import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextPage } from 'next';
import Head from 'next/head';
import PayMethodForm from '../../components/paymethods/PayMethodForm';

export const getServerSideProps = withPageAuth({ redirectTo: '/signin' });

const AddMethod: NextPage = () => {
  return (
    <>
      <Head>
        <title>Add Payment Method</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <div className="ml-18 mr-18 mx-auto min-h-screen max-w-screen-2xl p-16">
        <PayMethodForm formName="Add Payment Method" />
      </div>
    </>
  );
};

export default AddMethod;
