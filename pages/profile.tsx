import { PencilAltIcon, TrashIcon } from '@heroicons/react/outline';
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { User } from '@supabase/supabase-js';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Heading from '../components/common/Heading';
import DeleteModal from '../components/modals/DeleteModal';
import { Certificate } from '../models/Certificate';
import { supabase } from '../utils/supabaseClient';
// @ts-ignore
import ModalImage from 'react-modal-image';
import Loading from '../components/common/Loading';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [certToUrlMap, setCertToUrlMap] = useState<Map<Certificate, string | null | undefined>>(
    new Map()
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [certName, setCertName] = useState('');
  const [certId, setCertId] = useState('');
  const [certImage, setCertImage] = useState('');

  const handleOnClose = () => setShowDeleteModal(false);

  useEffect(() => {
    getCertificates();
  }, [user, showDeleteModal]);

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
          const retrievedCertToUrlMap = new Map<Certificate, string | null | undefined>();
          for (const cert of data) {
            const certUrl: string | null | undefined = await downloadCertificate(cert.image);
            retrievedCertToUrlMap.set(cert, certUrl);
          }
          setCertToUrlMap(retrievedCertToUrlMap);
          setLoading(false);
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

      setShowDeleteModal(false);
    }
  }

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <main className="flex h-screen w-full flex-col py-20 px-10">
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
          {loading ? (
            <Loading />
          ) : certToUrlMap.size === 0 ? (
            'No records found'
          ) : (
            Array.from(certToUrlMap.keys()).map((cert) => {
              return (
                <div
                  className="grid grid-cols-6 place-items-center gap-2 py-2 px-1 text-lg"
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
                    <i>Valid Until:</i> {cert.expirydate.toString()}
                  </div>

                  <div className="col-span-1">
                    <p className="break-all">{cert.type}</p>
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
                          setShowDeleteModal(true);
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

        {/* Delete Modal */}
        <DeleteModal
          visible={showDeleteModal}
          onClose={handleOnClose}
          contentString={`Do you want to delete ${certName}?`}
          deleteOnClick={deleteCertificate}
        />
      </main>
    </>
  );
}
