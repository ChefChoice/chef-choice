import { EyeIcon, PencilIcon, XCircleIcon } from '@heroicons/react/outline';
import { User } from '@supabase/supabase-js';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '../components/common/Heading';
import { Certificate } from '../models/Certificate';
import { supabase } from '../utils/supabaseClient';
import SignIn from './signin';

// TODO: integrate global userContext later

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    getCertificates();
  });

  async function getCertificates() {
    if (certificates.length == 0) {
      try {
        setLoading(true);
        setUser(supabase.auth.user());

        if (user) {
          let { data, error, status } = await supabase
            .from<Certificate>('Certificate')
            .select(`*`)
            // select by homechef_id
            .eq('homechef_id', user.id);

          if (error && status !== 406) {
            throw error;
          }

          if (data) {
            setCertificates(data);
          }
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
      {!user ? (
        <SignIn />
      ) : (
        <>
          <Head>
            <title>Profile</title>
            <meta content="width=device-width, initial-scale=1" name="viewport" />
          </Head>

          <main className="flex flex-col h-screen w-full py-20 px-10">
            <Header
              title={'Certification Management'}
              optionalNode={
                <button className="bg-white border-solid border-black border-2 hover:ring font-medium px-8 rounded">
                  Add
                </button>
              }
              optionalNodeRightAligned={true}
            />

            <div className="w-full">
              {loading ? 'Loading...' : ''}
              {certificates &&
                certificates.map((cert: Certificate) => {
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
      )}
    </>
  );
}
