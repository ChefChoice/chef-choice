import type { NextPage } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import { supabase } from '../../utils/supabaseClient';
import RowItem from '../../components/common/RowItem';
import Heading from '../../components/common/Heading';
import { PlusCircleIcon, PencilAltIcon, TrashIcon } from '@heroicons/react/outline';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User } from '@supabase/supabase-js';
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

const DishManagement: NextPage = () => {
  const [dishes, setDishes] = useState<Array<any>>([]);
  const [user, setUser] = useState<User | any>(null);
  const [bucketURL, setBucketURL] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    getDishes();
  }, [user]);

  const getDishes = async () => {
    setUser(supabase.auth.user());
    if (user) {
      const { data: dishData, error: dishError } = await supabase
        .from('Dish')
        .select('dish_id, user_id, dish_image, dish_name, dish_section, dish_price, dish_image')
        .eq('user_id', user.id)
        .order('dish_name');

      if (dishError) throw dishError.message;
      if (dishData) setDishes(dishData);

      const { publicURL, error: imageError } = supabase.storage
        .from('dish-images')
        .getPublicUrl('');
      if (imageError) throw imageError;

      setBucketURL(publicURL);
    }
  };

  const deleteDish = async (dishId: string) => {
    // prompt with modal here
    const filteredDishes = dishes?.filter((dish) => dish.dish_id !== dishId);
    const { error } = await supabase.from('Dish').delete().match({ dish_id: dishId });
    if (error) throw error;
    setDishes(filteredDishes);
  };

  return (
    <>
      <Head>
        <title>Dish Management</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <div className="max-w-screen-2xl min-h-screen mx-auto p-16 ml-18 mr-18">
        <Heading
          title="Your Dishes"
          optionalNode={
            <PlusCircleIcon
              className="h-8 w-8 stroke-1 hover:stroke-2 cursor-pointer"
              onClick={() => router.push('/dish-management/add-dish')}
            />
          }
          optionalNodeRightAligned={true}
        />

        <div className="grid gap-10 grid-cols-1">
          {dishes &&
            dishes.map((dish: any) => (
              <RowItem
                key={dish.dish_id}
                rowID={dish.dish_id}
                title={dish.dish_name}
                subtitle={dish.dish_price}
                image={
                  <Image
                    src={`${bucketURL}${dish.dish_image}`}
                    alt={`Picture of ${dish.dish_name}`}
                    width={250}
                    height={250}
                    className="object-cover"
                  />
                }
                optionalNode={
                  <div className="flex flex-row space-x-3 justify-self-end self-center">
                    <div>
                      <PencilAltIcon
                        className="h-8 w-8 stroke-1 hover:stroke-2 cursor-pointer"
                        onClick={() => router.push(`/dish-management/edit-dish/${dish.dish_id}`)}
                      />
                    </div>
                    <div>
                      <TrashIcon
                        className="h-8 w-8 stroke-1 hover:stroke-2 cursor-pointer"
                        onClick={() => deleteDish(dish.dish_id)}
                      />
                    </div>
                  </div>
                }
                optionalNodeRightAligned={true}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default DishManagement;
