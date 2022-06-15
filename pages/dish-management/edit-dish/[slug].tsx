import { User } from '@supabase/supabase-js';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DishForm from '../../../components/dishes/DishForm';
import { supabase } from '../../../utils/supabaseClient';
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';

export const getServerSideProps = withPageAuth({ redirectTo: '/signin' });

const EditDish: NextPage = () => {
  const [dish, setDish] = useState<any>();
  const [user, setUser] = useState<User | any>(null);
  const [bucketURL, setBucketURL] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    getDish();
  }, [user, router]);

  const getDish = async () => {
    if (router.isReady) {
      setUser(supabase.auth.user());
      if (user) {
        const { data, error } = await supabase
          .from('Dish')
          .select('*')
          .eq('user_id', user.id)
          .eq('dish_id', router.query.slug);

        if (error) throw error.message;
        if (data) setDish(data[0]);

        const { publicURL, error: imageError } = supabase.storage
          .from('dish-images')
          .getPublicUrl('');
        if (imageError) throw imageError;

        setBucketURL(publicURL);
      }
    }
  };

  return (
    <>
      {dish && (
        <Head>
          <title>Edit Dish - {dish.dish_name}</title>
          <meta content="width=device-width, initial-scale=1" name="viewport" />
        </Head>
      )}

      <div className="max-w-screen-2xl min-h-screen mx-auto p-16 ml-18 mr-18">
        {dish && (
          <DishForm
            formName="Edit Dish"
            dishId={dish.dish_id}
            dishName={dish.dish_name}
            hasImage={true}
            imageURL={`${bucketURL}${dish.dish_image}`}
            dishPrice={dish.dish_price}
            dishSection={dish.dish_section}
            dishCategory={dish.dish_category}
            dishDescription={dish.dish_description}
            dishIngredients={dish.dish_ingredients}
          />
        )}
      </div>
    </>
  );
};

export default EditDish;
