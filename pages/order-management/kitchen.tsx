// TODO: Move file to appropriate directory

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';

import { supabase } from '../../utils/supabaseClient';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import ContentContainer from '../../components/orders/ContentContainer';
import Heading from '../../components/common/Heading';
import RowItem from '../../components/common/RowItem';
import SmallButton from '../../components/orders/SmallButton';

const testChefID = '4a1abd67-53f4-4a24-8a8b-569729e6fb95'; // TODO: Temporary hard-coded value until Context

const Kitchen: NextPage = () => {
  const [homechef, setHomeChef] = useState<Array<any> | null>(null);
  const [dishes, setDishes] = useState<Array<any> | null>(null);
  const [publicURL, setPublicURL] = useState<any | null>(null);

  useEffect(() => {
    const getData = async () => {
      let { data: HomeChef, error: HomeChefError } = await supabase
        .from('HomeChef')
        .select('*')
        .eq('HOMECHEF_ID', testChefID);

      if (HomeChefError) throw HomeChefError.message;
      setHomeChef(HomeChef);

      let { data: Dishes, error: DishesError } = await supabase
        .from('Dish')
        .select('*')
        .eq('user_id', testChefID);

      if (DishesError) throw DishesError.message;
      setDishes(Dishes);

      const { publicURL: PublicURL, error: PublicURLError } = supabase.storage
        .from('dish-test-orders')
        .getPublicUrl('');
      if (PublicURLError) throw PublicURLError.message;
      setPublicURL(PublicURL);
    };

    getData().catch(console.error);
  }, []);

  return (
    <>
      <Head>
        {homechef ? <title>Chef {homechef[0].HOMECHEF_NAME}</title> : <title>Chef ...</title>}
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <ContentContainer>
        <div className="flex">
          {homechef && (
            <h3 className="text-4xl font-bold pr-5">Chef {homechef[0].HOMECHEF_NAME}</h3>
          )}
          <SmallButton data={'View Schedule'} />
        </div>
        <div>100 Queen St W, Toronto, ON M5H 2N1</div> {/* TODO: Temporary hard-coded value */}
        <div className="grow flex flex-col pt-5">
          <div>
            <Heading title={'Dinner'}></Heading>
            <div>
              {dishes?.map((dish) => (
                <RowItem
                  key={dish.id}
                  title={dish.dish_name}
                  subtitle={dish.dish_price}
                  image={<Image src={publicURL + dish.dish_image} width={100} height={100}></Image>}
                  optionalNode={<SmallButton data={'Add to Order'} />}
                  optionalNodeRightAligned
                />
              ))}
            </div>
          </div>
        </div>
        <div className="md:w-full flex gap-2 pt-5 justify-end">
          <Link href="/order-management/checkout">
            <div className="max-w-xs w-full bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-4 hover:border-green hover:ring hover:bg-green-hover py-5 px-5 text-center">
              <a className="font-bold text-white lg:text-base xs:text-xs hover:text-black">
                Go to checkout
              </a>
            </div>
          </Link>
        </div>
      </ContentContainer>
    </>
  );
};

export default Kitchen;
