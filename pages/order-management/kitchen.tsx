// TODO: Move file to appropriate directory

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';

// import { supabase } from '../../utils/supabaseClient';
import { getKitchen } from '../../utils/fetchUtils';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import ContentContainer from '../../components/orders/ContentContainer';
import Heading from '../../components/common/Heading';
import RowItem from '../../components/common/RowItem';
import SmallButton from '../../components/orders/SmallButton';
import Stars from '../../components/orders/Stars';

const testChefID = '4a1abd67-53f4-4a24-8a8b-569729e6fb95'; // TODO: Temporary hard-coded value until Context
const stars: number = 4; // TODO: Temporary hard-coded rating

const Kitchen: NextPage = () => {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    getKitchen(testChefID)
      .then((data) => {
        setData(data);
      })
      .catch(console.error);
  }, []);

  const addToOrder = (id: any) => {
    console.log('clicked', id);
  };

  return (
    <>
      <Head>
        {data ? <title>Chef {data.HomeChef[0].name}</title> : <title>Chef ...</title>}
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <ContentContainer>
        <div className="flex flex-col gap-y-4 lg:flex-row">
          {data && <h3 className="pr-5 text-4xl font-bold">Chef {data.HomeChef[0].name}</h3>}
          <div className="w-52">
            <SmallButton data={'View Schedule'} />
          </div>
          <Stars stars={data ? data.HomeChef[0].rating : 0} />
        </div>
        <div>100 Queen St W, Toronto, ON M5H 2N1</div> {/* TODO: Temporary hard-coded value */}
        <div className="flex grow flex-col pt-5">
          <Heading title={'Dinner'}></Heading>
          <div>
            {data &&
              data.Dishes.map((dish: any) => (
                <div key={dish.dish_id}>
                  <RowItem
                    key={dish.dish_id}
                    rowID={dish.dish_id}
                    title={dish.dish_name}
                    subtitle={dish.dish_price}
                    image={
                      <Image
                        src={data.PublicURL + '/' + dish.dish_image}
                        alt={dish.dish_name}
                        width={100}
                        height={100}
                      ></Image>
                    }
                    optionalNode={
                      <div onClick={() => addToOrder(dish.dish_id)}>
                        <SmallButton data={'Add to Order'} />
                      </div>
                    }
                    optionalNodeRightAligned
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-5 md:w-full">
          <Link href="/order-management/checkout">
            <div className="hover:border-green w-full max-w-xs overflow-hidden rounded border-2 border-solid border-green-light bg-green-light py-5 px-5 text-center shadow-lg hover:border-4 hover:bg-green-hover hover:ring">
              <a className="xs:text-xs font-bold text-white hover:text-black lg:text-base">
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
