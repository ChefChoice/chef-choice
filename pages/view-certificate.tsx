import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function ViewCertificate() {
  const [certImageURL, setCertImageURL] = useState(null);

  const router = useRouter();
  const query = router.query;
  const imgPath = query.cert_image;

  useEffect(() => {
    if (imgPath) downloadImage(imgPath);
  }, [imgPath]);

  async function downloadImage(imgPath) {
    try {
      const { data, error } = await supabase.storage.from('cert-images').download(imgPath);
      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      console.log('abc');
      console.log(url);
      console.log(data);

      setCertImageURL(url);
    } catch (error) {
      console.log('Error downloading image: ', error.message);
    }
  }

  return (
    <>
      <Head>
        <title>View Certificate</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <main className="py-20 px-10">
        {certImageURL ? (
          <Image
            src={certImageURL}
            alt="certificate image"
            layout="responsive"
            width={2000}
            height={1000}
            objectFit="scale-down"
          />
        ) : (
          <p>no-image for this certificate</p>
        )}
      </main>
    </>
  );
}
