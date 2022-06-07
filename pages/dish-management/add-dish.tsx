import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextPage } from 'next';
import DishForm from '../../components/dishes/DishForm';

export const getServerSideProps = withPageAuth({ redirectTo: '/signin' });

const AddDish: NextPage = () => {
  return (
    <>
      <div className="max-w-screen-2xl min-h-screen mx-auto p-16 ml-18 mr-18">
        <DishForm formName="Add Dish" hasImage={false} imageURL="/images/placeholder.jpg" />
      </div>
    </>
  );
};

export default AddDish;
