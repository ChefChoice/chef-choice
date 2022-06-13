import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import Head from 'next/head';
import CertForm from '../../components/certificates/CertForm';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

export default function AddCertificate() {
  return (
    <>
      <Head>
        <title>Add Certificate</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <main className="flex flex-col h-screen w-full py-10 px-10 mx-auto">
        <CertForm formName="Add Certificate" certificate={null} />
      </main>
    </>
  );
}
