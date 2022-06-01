import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { EyeIcon, PencilIcon, XCircleIcon } from '@heroicons/react/outline';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [certs, setCert] = useState<Certificate[]>([]);

  type Certificate = {
    id: number;
    homechef_id: number;
    cert_type: string;
    cert_name: string;
    cert_expirydate: Date;
    cert_image: string;
  };

  useEffect(() => {
    getCert();
  });

  async function getCert() {
    if (certs.length == 0) {
      try {
        setLoading(true);

        let { data, error, status } = await supabase
          .from<Certificate>('Certificate')
          .select(`*`)
          // select by homechef_id
          .eq('homechef_id', 1);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setCert(data);
        }
      } catch (err) {
        console.log(err);
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
          {loading ? 'Loading...' : ''}
          {certs &&
            certs.map((cert: Certificate) => {
              return (
                <div className="grid grid-cols-6 gap-2 py-2 px-3 text-lg" key={cert.id}>
                  <div className="col-span-2">
                    <p className="break-words">{cert.cert_name}</p>
                  </div>
                  <div className="col-span-2 break-words">
                    <i>Valid Until:</i> {cert.cert_expirydate.toString()}
                  </div>

                  <div className="break-words">
                    {cert.cert_type == 'Required' ? (
                      <p>{cert.cert_type}</p>
                    ) : (
                      <p>
                        <i>{cert.cert_type}</i>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-rows-1 grid-flow-col ml-auto">
                    <Link
                      href={{
                        pathname: '/view-certificate',
                        query: { cert_image: cert.cert_image },
                      }}
                    >
                      <a className="mr-8" target="_blank">
                        <EyeIcon className="h-6 w-6" />
                      </a>
                    </Link>
                    <Link href="/edit-certificate">
                      <a className="mr-8">
                        <PencilIcon className="h-6 w-6" />
                      </a>
                    </Link>

                    {/* Check if it is allowed to delete the certificate */}
                    <Link href="">
                      {cert.cert_type == 'Required' ? (
                        <a className="ml-6">
                          <XCircleIcon className="h-6 w-6 hidden" />
                        </a>
                      ) : (
                        <a className="ml-auto">
                          <XCircleIcon className="h-6 w-6" />
                        </a>
                      )}
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </>
  );
}
