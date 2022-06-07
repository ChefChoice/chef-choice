import { User } from '@supabase/supabase-js';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser } from '../../lib/UserContext';
import { supabase } from '../../utils/supabaseClient';
import SignIn from '../signin';

// TODO: integrate global userContext later

export default function ViewCertificate() {
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  const [certImageURL, setCertImageURL] = useState('');

  const router = useRouter();
  const query = router.query;
  // Take the image path from query
  const imgPath = query.cert_image;

  useEffect(() => {
    if (imgPath) downloadImage(imgPath);
  }, [imgPath]);

  async function downloadImage(imgPath: any) {
    try {
      setLoading(true);

      const { data, error } = await supabase.storage.from('cert-images').download(imgPath);
      if (error) {
        throw error;
      }

      if (data) {
        const url = URL.createObjectURL(data);
        setCertImageURL(url);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading ? (
        <SignIn />
      ) : (
        <>
          <Head>
            <title>View Certificate</title>
            <meta content="width=device-width, initial-scale=1" name="viewport" />
          </Head>

          <main className="py-20 px-10 bg-gray-200">
            {loading ? 'Loading...' : ''}
            {certImageURL && (
              <Image
                src={certImageURL}
                alt="certificate image"
                layout="responsive"
                width={2000}
                height={1000}
                objectFit="scale-down"
              />
            )}
          </main>
        </>
      )}
    </>
  );
}
