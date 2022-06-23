import { EyeIcon, PencilAltIcon, TrashIcon, XCircleIcon } from '@heroicons/react/outline';
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { User } from '@supabase/supabase-js';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Heading from '../../components/common/Heading';
import { Certificate } from '../../models/Certificate';
import { supabase } from '../../utils/supabaseClient';
// @ts-ignore
import ModalImage from 'react-modal-image';
import Loading from '../../components/common/Loading';
import Modal from '../../components/modals/Modal';
import { useUser } from '../../lib/UserContext';
import { NextPage } from 'next';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

const Profile: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const { user: userSession, isHomeChef } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [certToUrlMap, setCertToUrlMap] = useState<Map<Certificate, string | null | undefined>>(
    new Map()
  );
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [userData, setUserData] = useState<any>();
  const [address, setAddress] = useState<any>();

  const [showModal, setShowModal] = useState(false);
  const [certName, setCertName] = useState('');
  const [certId, setCertId] = useState('');
  const [certImage, setCertImage] = useState('');

  const closeModal = () => setShowModal(false);

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
            // put required certificate on top then A-Z
            .order('type', { ascending: false })
            .order('name', { ascending: true });

          if (error && status !== 406) {
            throw error;
          }

          if (data) {
            const retrievedCertToUrlMap = new Map<Certificate, string | null | undefined>();
            for (const cert of data) {
              const certUrl: string | null | undefined = await downloadCertificate(cert.image);
              retrievedCertToUrlMap.set(cert, certUrl);
            }
            setCertToUrlMap(retrievedCertToUrlMap);
            setLoading(false);
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

  async function downloadCertificate(image: string) {
    try {
      if (user) {
        const authorizedImgPath = `${user.id}/${image}?t=${Date.now()}`;

        const { data, error } = await supabase.storage
          .from('cert-images')
          .download(authorizedImgPath);

        if (error) {
          throw error;
        }

        if (data) {
          const url = URL.createObjectURL(data);
          return url;
        }
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async function deleteCertificate() {
    if (user) {
      const imagePath = `${user.id}/${certImage}`;

      // delete from storage
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
              title={'Certificate Management'}
              optionalNode={
                <Link
                  href={{
                    pathname: '/certificate-management/add-certificate',
                    query: {
                      id: user ? user.id : null,
                    },
                  }}
                >
                  <button className="rounded border-2 border-solid border-black bg-white py-1 px-8 text-lg font-medium hover:ring hover:ring-green-light">
                    Add
                  </button>
                </Link>
              }
              optionalNodeRightAligned={true}
            />

            <div className="w-full">
              {loading ? (
                <Loading />
              ) : certToUrlMap.size === 0 ? (
                'No records found'
              ) : (
                Array.from(certToUrlMap.keys()).map((cert) => {
                  return (
                    <div
                      className="grid grid-cols-7 place-items-center gap-2 py-2 px-1 text-lg"
                      key={cert.id}
                    >
                      <div className="w-8 sm:w-20" title="View Certificate">
                        <ModalImage
                          small={certToUrlMap.get(cert)}
                          large={certToUrlMap.get(cert)}
                          hideZoom={true}
                          alt={cert.name}
                        />
                      </div>
                      <div className="col-span-2 justify-self-start">
                        <p className="break-all">{cert.name}</p>
                      </div>
                      <div className="col-span-1 break-words">
                        Valid Until: {cert.expirydate.toString()}
                      </div>

                      <div className="col-span-1">
                        <p className="break-all">{cert.type}</p>
                      </div>

                      <div className="col-span-1">
                        <i className="break-all">{cert.status}</i>
                      </div>

                      <div className="ml-auto grid grid-flow-col grid-rows-2 sm:grid-rows-1">
                        <Link
                          href={{
                            pathname: '/certificate-management/edit-certificate',
                            query: { cert_id: cert.id },
                          }}
                        >
                          <a className="mr-8" title="Edit">
                            <PencilAltIcon className="h-6 w-6" />
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
                            <a className="ml-auto" title="Delete">
                              <TrashIcon className="h-6 w-6" />
                            </a>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Delete Modal */}
        <Modal
          visible={showModal}
          title={'Confirm Deletion'}
          content={<p className="mx-2 mb-4 break-all text-lg">Do you want to delete {certName}?</p>}
          leftBtnText={'Delete'}
          leftBtnOnClick={deleteCertificate}
          rightBtnText={'Cancel'}
          rightBtnOnClick={closeModal}
          hideLeftBtn={false}
        />
      </main>
    </>
  );
};

export default Profile;
