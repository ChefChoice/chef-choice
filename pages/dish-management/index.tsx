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
import Modal from '../../components/modals/Modal';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

const DishManagement: NextPage = () => {
  const [dishes, setDishes] = useState<Array<any>>([]);
  const [user, setUser] = useState<User | any>(null);
  const [bucketURL, setBucketURL] = useState<any>(null);
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);
  const [dishName, setDishName] = useState('');
  const [dishId, setDishId] = useState('');

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

  const deleteDish = async () => {
    try {
      const deleteableDish = dishes?.filter((dish) => dish.dish_id == dishId)[0];
      const filteredDishes = dishes?.filter((dish) => dish !== deleteableDish);

      const { error: imageError } = await supabase.storage
        .from('dish-images')
        .remove([deleteableDish.dish_image]);

      if (imageError) throw imageError;

      const { error: dishError } = await supabase.from('Dish').delete().match({ dish_id: dishId });

      if (dishError) throw dishError;

      setShowModal(false);
      setDishes(filteredDishes);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Head>
        <title>Dish Management</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <div className="ml-18 mr-18 mx-auto min-h-screen max-w-screen-2xl p-16">
        <Heading
          title="Your Dishes"
          optionalNode={
            <div title={`Add New Dish`}>
              <PlusCircleIcon
                className="h-8 w-8 cursor-pointer stroke-1 hover:stroke-2"
                onClick={() => router.push('/dish-management/add-dish')}
              />
            </div>
          }
          optionalNodeRightAligned={true}
        />

        <div className="grid grid-cols-1 gap-10">
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
                  <div className="flex flex-row space-x-3 self-center justify-self-end">
                    <div title={`Edit Dish: ${dish.dish_name}`}>
                      <PencilAltIcon
                        className="h-8 w-8 cursor-pointer stroke-1 hover:stroke-2"
                        onClick={() => router.push(`/dish-management/edit-dish/${dish.dish_id}`)}
                      />
                    </div>
                    <div title={`Delete Dish: ${dish.dish_name}`}>
                      <TrashIcon
                        className="h-8 w-8 cursor-pointer stroke-1 hover:stroke-2"
                        onClick={() => {
                          setShowModal(true);
                          setDishName(dish.dish_name);
                          setDishId(dish.dish_id);
                        }}
                      />
                    </div>
                  </div>
                }
                optionalNodeRightAligned={true}
              />
            ))}
        </div>
      </div>

      <Modal
        visible={showModal}
        title={'Confirm Deletion'}
        content={<p className="mx-2 mb-4 break-all text-lg">Do you want to delete {dishName}?</p>}
        leftBtnText={'Delete'}
        leftBtnOnClick={deleteDish}
        rightBtnText={'Cancel'}
        rightBtnOnClick={closeModal}
        hideLeftBtn={false}
      />
    </>
  );
};

export default DishManagement;
