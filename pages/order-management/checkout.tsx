import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { supabase } from '../../utils/supabaseClient';

import CartItem from '../../components/orders/CartItem';
import RowItem from '../../components/common/RowItem';
import Heading from '../../components/common/Heading';
import ContentContainer from '../../components/orders/ContentContainer';
import SmallButton from '../../components/orders/SmallButton';

const orderID = 1;

const Checkout: NextPage = () => {
  // console.log('render'); // TODO: Remove console.log

  const [order, setOrder] = useState<Array<any> | null>(null);
  const [orderDishes, setOrderDishes] = useState<Array<any> | null>(null);

  useEffect(() => {
    const getData = async () => {
      let { data: Order, error: OrderError } = await supabase
        .from('Order')
        .select(`*, "HomeChef" ("HOMECHEF_NAME")`)
        .eq('ORDER_ID', orderID);

      let { data: Order_Dish, error: OrderDishError } = await supabase
        .from('Order_Dish')
        .select(`*, "Dish" (dish_name, dish_price)`)
        .eq('ORDER_ID', orderID);

      if (OrderError) throw OrderError.message;
      if (OrderDishError) throw OrderDishError.message;

      setOrder(Order);
      setOrderDishes(Order_Dish);
    };

    getData().catch(console.error); // TODO: Remove the console error
  }, []);

  const handleClick = async () => {
    console.log('clicked!');

    const { data, error } = await supabase
      .from('Order')
      .update({ ORDER_STATUS: 'P' })
      .eq('ORDER_ID', '1');
  };

  return (
    <>
      <Head>
        <title>Checkout</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <ContentContainer>
        {order && <h3 className="text-4xl font-bold">Chef {order[0].HomeChef.HOMECHEF_NAME}</h3>}
        <div className="flex gap-x-16 mx-auto pt-6">
          <div className="grow">
            <Heading title={'Your Items'}></Heading>
            <div className="md:w-full">
              {orderDishes?.map((orderDish, i) => (
                <CartItem
                  key={i}
                  title={orderDish.Dish.dish_name}
                  price={orderDish.Dish.dish_price}
                ></CartItem>
              ))}
            </div>
            <div className="flex md:w-full font-semibold">
              <div className="grow">SubTotal</div>
              <div>$31.99</div>
            </div>
            <div className="flex md:w-full">
              <div className="grow">Tax and Fees</div>
              <div>$4.28</div>
            </div>
            <div className="flex md:w-full font-bold text-lg">
              <div className="grow">Total</div>
              <div>$36.27</div>
            </div>
          </div>
          <div className="grow flex flex-col max-w-xl">
            <div>
              <Heading title={'Address'}></Heading>
              <RowItem
                key={0}
                title=""
                subtitle="100 Queen St W, Toronto, ON M5H 2N1"
                optionalNode={<SmallButton data={'Edit'} />}
                optionalNodeRightAligned
              />
            </div>
            <div>
              <Heading title={'Payment'}></Heading>
              <RowItem
                key={0}
                title=""
                subtitle="Visa ending in 4321"
                optionalNode={<SmallButton data={'Edit'} />}
                optionalNodeRightAligned
              />
            </div>
            <div>
              <Heading title={'Scheduled Time'}></Heading>
              <RowItem
                key={0}
                title=""
                subtitle="None selected"
                optionalNode={<SmallButton data={'Edit'} />}
                optionalNodeRightAligned
              />
            </div>
            <Link href="/order-management/post-checkout">
              <div
                onClick={handleClick}
                className="mt-10 self-end max-w-xs w-full bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-4 hover:border-green hover:ring hover:bg-green-hover"
              >
                <div className="py-5 px-5 text-center">
                  <a className="font-bold text-white lg:text-base xs:text-xs hover:text-black">
                    Place Order
                  </a>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </ContentContainer>
    </>
  );
};

export default Checkout;
