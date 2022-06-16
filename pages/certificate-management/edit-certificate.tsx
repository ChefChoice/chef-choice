import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { User } from '@supabase/supabase-js';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CertForm } from '../../components/certificates/CertForm';
import { Certificate } from '../../models/Certificate';
import { supabase } from '../../utils/supabaseClient';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

export default function EditCertificate() {
  const { query } = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);

  // Take the image path from query
  const certId = query.cert_id as string;

  useEffect(() => {
    setUser(supabase.auth.user());
    if (certId) getCertificate();
  }, [user]);

  async function getCertificate() {
    if (user) {
      const { data, error } = await supabase
        .from<Certificate>('Certificate')
        .select(`*`)
        .eq('homechef_id', user.id)
        .eq('id', certId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setCertificate(data);
      }
    }
  }

  return (
    <>
      <Head>
        <title>Edit Certificate</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <main className="flex flex-col h-screen w-full py-10 px-10 mx-auto">
        {certificate && <CertForm formName="Edit Certificate" certificate={certificate} />}
      </main>
    </>
  );
}
