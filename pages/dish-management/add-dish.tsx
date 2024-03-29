import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextPage } from 'next';
import Head from 'next/head';
import DishForm from '../../components/dishes/DishForm';

export const getServerSideProps = withPageAuth({ redirectTo: '/signin' });

const AddDish: NextPage = () => {
  return (
    <>
      <Head>
        <title>Add Dish</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <div className="max-w-screen-2xl min-h-screen mx-auto p-16 ml-18 mr-18">
        <DishForm formName="Add Dish" hasImage={false} imageURL="/images/placeholder.jpg" />
      </div>
    </>
  );
};

export default AddDish;
