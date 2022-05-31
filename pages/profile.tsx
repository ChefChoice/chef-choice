import Head from 'next/head';
import Link from 'next/link';
import { EyeIcon, PencilIcon, XCircleIcon } from '@heroicons/react/outline';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [certs, setCert] = useState(null);

  useEffect(() => {
    getCert();
  });

  async function getCert() {
    if (certs == null) {
      try {
        setLoading(true);

        let { data, error, status } = await supabase
          .from('Certificate')
          .select(`*`)
          // select by homechef_id
          .eq('homechef_id', 1);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setCert(data);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <main className="flex flex-col h-screen w-full py-20 px-10">
        <div className="flex w-full justify-end mx-auto">
          <div className="mr-auto">
            <h2 className="text-xl font-headline font-medium pr-20 break-words">
              Certification Management
            </h2>
          </div>

          <button className="bg-white border-solid border-black border-2 hover:ring font-medium px-8 rounded">
            Add
          </button>
        </div>
        <div className="pt-1 pb-4">
          {' '}
          <hr style={{ borderTop: '3px solid #4D966D' }} />
        </div>

        <div className="w-full">
          {certs &&
            certs.map((cert) => {
              return (
                <div className="grid grid-cols-8 gap-2 py-2 px-3 text-lg" key={cert.id}>
                  <div className="col-span-2">
                    <p className="break-words">{cert.cert_name}</p>
                  </div>
                  <div className="col-span-3 mx-auto">
                    <p className="break-words">Expiry Date: {cert.cert_expirydate}</p>
                  </div>
                  <Link
                    href={{ pathname: '/view-certificate', query: { cert_image: cert.cert_image } }}
                  >
                    <a className="ml-auto">
                      <EyeIcon className="h-5 w-5" />
                    </a>
                  </Link>
                  <Link href="#">
                    <a className="ml-auto">
                      <PencilIcon className="h-5 w-5" />
                    </a>
                  </Link>

                  {/* Check if it is allowed to delete the certificate */}
                  {cert.cert_type != 'Required' && (
                    <Link href="#">
                      <a className="ml-auto">
                        <XCircleIcon className="h-5 w-5" />
                      </a>
                    </Link>
                  )}
                </div>
              );
            })}
        </div>
      </main>
    </>
  );
}
