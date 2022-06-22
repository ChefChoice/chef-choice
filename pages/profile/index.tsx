import { EyeIcon, PencilIcon, XCircleIcon } from '@heroicons/react/outline';
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { User } from '@supabase/supabase-js';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Heading from '../../components/common/Heading';
import DeleteModal from '../../components/modals/DeleteModal';
import { Certificate } from '../../models/Certificate';
import { supabase } from '../../utils/supabaseClient';
import { useUser } from '../../lib/UserContext';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

const Profile: NextPage = () => {
  const { user: userSession, isHomeChef } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [userData, setUserData] = useState<any>();
  const [address, setAddress] = useState<any>();

  const [showModal, setShowModal] = useState(false);
  const [certName, setCertName] = useState('');
  const [certId, setCertId] = useState('');
  const [certImage, setCertImage] = useState('');

  const handleOnClose = () => setShowModal(false);

  useEffect(() => {
    getData();
  }, [user, showModal]);

  async function getData() {
    try {
      setUser(supabase.auth.user());

      if (user) {
        if (isHomeChef) {
          const { data: homeChefData, error: homeChefError } = await supabase
            .from('HomeChef')
            .select(`*, address:address_id(*)`)
            .eq('id', user.id);

          if (homeChefError) throw homeChefError.message;
          if (homeChefData) {
            setUserData(homeChefData[0]);
            console.log(homeChefData);
          }

          let { data, error, status } = await supabase
            .from<Certificate>('Certificate')
            .select(`*`)
            // select by homechef_id
            .eq('homechef_id', user.id)
            // put required certificate on top
            .order('type', { ascending: false });

          if (error && status !== 406) {
            throw error;
          }

          if (data) {
            setCertificates(data);
          } else {
            setCertificates([]);
          }
        } else {
          let {
            data: consumerData,
            error: consumerError,
            status: consumerStatus,
          } = await supabase
            .from('Consumer')
            .select('name')
            .select(`*, address:address_id(*)`)
            .eq('id', user.id);

          if (consumerError && consumerStatus !== 406) {
            throw consumerError;
          }

          if (consumerData) {
            setUserData(consumerData[0]);
            console.log(consumerData);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteCertificate() {
    // delete from storage
    if (user) {
      const imagePath = `${user.id}/${certImage}`;
      const { error: storageError } = await supabase.storage
        .from('cert-images')
        .remove([imagePath]);

      if (storageError) {
        throw storageError;
      }

      // delete from database
      const { error: deleteError } = await supabase
        .from('Certificate')
        .delete()
        .match({ id: certId });

      if (deleteError) {
        throw deleteError;
      }

      setShowModal(false);
    }
  }

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <main className="flex h-screen w-full flex-col py-20 px-10">
        <div>
          <Heading
            title={'Account Details'}
            optionalNode={
              <div className="flew space-x-2">
                <Link
                  href={{
                    pathname: '#',
                    query: {
                      id: user ? user.id : null,
                    },
                  }}
                >
                  <button className="rounded border-2 border-solid border-black bg-white py-1 px-8 text-lg font-medium hover:ring">
                    Payout Management
                  </button>
                </Link>
                <Link
                  href={{
                    pathname: '/profile/edit',
                  }}
                >
                  <button className="rounded border-2 border-solid border-black bg-white py-1 px-8 text-lg font-medium hover:ring">
                    Edit
                  </button>
                </Link>
              </div>
            }
            optionalNodeRightAligned={true}
          />
          <div className="ml-8">
            <div>Name: {userData?.name}</div>
            <div>Email Address: {userData?.email}</div>
            <div>Phone Number: {userData?.phoneno}</div>
            <div>
              Address: {userData?.address?.street}, {userData?.address?.city},{' '}
              {userData?.address?.postalcode}
            </div>
          </div>
        </div>
        {isHomeChef && (
          <div>
            <Heading
              title={'Certification Management'}
              optionalNode={
                <Link
                  href={{
                    pathname: '/certificate-management/add-certificate',
                    query: {
                      id: user ? user.id : null,
                    },
                  }}
                >
                  <button className="rounded border-2 border-solid border-black bg-white py-1 px-8 text-lg font-medium hover:ring">
                    Add
                  </button>
                </Link>
              }
              optionalNodeRightAligned={true}
            />

            <div className="w-full">
              {certificates.length === 0
                ? 'No records found'
                : certificates.map((cert: Certificate) => {
                    return (
                      <div className="grid grid-cols-6 gap-2 py-2 px-3 text-lg" key={cert.id}>
                        <div className="col-span-2">
                          <p className="break-words">{cert.name}</p>
                        </div>
                        <div className="col-span-2 break-words">
                          <i>Valid Until:</i> {cert.expirydate.toString()}
                        </div>

                        <div className="break-words">
                          <p>{cert.type}</p>
                        </div>

                        <div className="ml-auto grid grid-flow-col grid-rows-3 sm:grid-rows-1">
                          <Link
                            href={{
                              pathname: '/certificate-management/view-certificate',
                              query: { cert_image: cert.image },
                            }}
                          >
                            <a className="mr-8" target="_blank">
                              <EyeIcon className="h-6 w-6" />
                            </a>
                          </Link>
                          <Link
                            href={{
                              pathname: '/certificate-management/edit-certificate',
                              query: { cert_id: cert.id },
                            }}
                          >
                            <a className="mr-8">
                              <PencilIcon className="h-6 w-6" />
                            </a>
                          </Link>

                          {/* No delete button for required certificate */}
                          {cert.type == 'Required' ? (
                            <div className="sm:ml-6"></div>
                          ) : (
                            <button
                              onClick={() => {
                                setShowModal(true);
                                setCertName(cert.name);
                                setCertId(cert.id);
                                setCertImage(cert.image);
                              }}
                            >
                              <a className="ml-auto" data-modal-toggle="popup-modal">
                                <XCircleIcon className="h-6 w-6" data-modal-toggle="popup-modal" />
                              </a>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        )}

        {/* Modal */}
        <DeleteModal
          visible={showModal}
          onClose={handleOnClose}
          contentString={`Do you want to delete ${certName}?`}
          deleteOnClick={deleteCertificate}
        />
      </main>
    </>
  );
};

export default Profile;
