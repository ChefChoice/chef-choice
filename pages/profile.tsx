import { EyeIcon, PencilIcon, XCircleIcon } from '@heroicons/react/outline';
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { User } from '@supabase/supabase-js';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Heading from '../components/common/Heading';
import DeleteModal from '../components/modals/DeleteModal';
import { Certificate } from '../models/Certificate';
import { supabase } from '../utils/supabaseClient';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [certName, setCertName] = useState('');
  const [certId, setCertId] = useState('');
  const [certImage, setCertImage] = useState('');

  const handleOnClose = () => setShowModal(false);

  useEffect(() => {
    getCertificates();
  }, [user, showModal]);

  async function getCertificates() {
    try {
      setUser(supabase.auth.user());

      if (user) {
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
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteCertificate(id: any) {
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

      <main className="flex flex-col h-screen w-full py-20 px-10">
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
              <button className="bg-white py-1 text-lg border-solid border-black border-2 hover:ring font-medium px-8 rounded">
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

                    <div className="grid grid-rows-3 sm:grid-rows-1 grid-flow-col ml-auto">
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

                      {/* Check if it is allowed to delete the certificate */}
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setCertName(cert.name);
                          setCertId(cert.id);
                          setCertImage(cert.image);
                        }}
                      >
                        {cert.type == 'Required' ? (
                          <a className="sm:ml-6">
                            <XCircleIcon className="h-6 w-6 hidden" />
                          </a>
                        ) : (
                          <a className="ml-auto" data-modal-toggle="popup-modal">
                            <XCircleIcon className="h-6 w-6" data-modal-toggle="popup-modal" />
                          </a>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Modal */}
        <DeleteModal
          visible={showModal}
          onClose={handleOnClose}
          contentString={`Do you want to delete ${certName}?`}
          deleteOnClick={() => deleteCertificate(certId)}
        />
      </main>
    </>
  );
}
