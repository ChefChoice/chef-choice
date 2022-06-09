import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';

import { supabase } from '../../utils/supabaseClient';

import CartItem from '../../components/orders/CartItem';
import RowItem from '../../components/common/RowItem';
import Heading from '../../components/common/Heading';
import ContentContainer from '../../components/orders/ContentContainer';
import SmallButton from '../../components/orders/SmallButton';

const orderID = 1; // TODO: Remove temporary hardcoded value

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

const Checkout: NextPage = () => {
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    getData().catch(console.error);
  }, []);

  const getData = async () => {
    let { data: order, error: OrderError } = await supabase
      .from('Order')
      .select(`*, "HomeChef" ("name")`)
      .eq('id', orderID);

    let { data: orderDish, error: OrderDishError } = await supabase
      .from('Order_Dish')
      .select(`*, "Dish" (dish_name, dish_price)`)
      .eq('order_id', orderID);

    if (OrderError) throw OrderError.message;
    if (OrderDishError) throw OrderDishError.message;

    setOrder({ order, orderDish });
  };

  const handleClick = async () => {
    const { data, error } = await supabase.from('Order').update({ status: 'P' }).eq('id', orderID);
  };

  return (
    <>
      <Head>
        <title>Checkout</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <ContentContainer>
        {order && <h3 className="text-4xl font-bold">Chef {order.order[0].HomeChef.name}</h3>}
        <div className="mx-auto flex gap-x-16 pt-6">
          <div className="grow">
            <Heading title={'Your Items'}></Heading>
            <div className="md:w-full">
              {order &&
                order.orderDish?.map((orderDish: any, i: any) => (
                  <CartItem
                    key={i}
                    quantity={orderDish.quantity}
                    title={orderDish.Dish.dish_name}
                    price={orderDish.Dish.dish_price * orderDish.quantity}
                  ></CartItem>
                ))}
            </div>
            <div className="flex font-semibold md:w-full">
              <div className="grow">SubTotal</div>
              <div>{order && `$` + order.order[0].subtotal}</div>
            </div>
            <div className="flex md:w-full">
              <div className="grow">Tax and Fees</div>
              <div>{order && `$` + order.order[0].fees}</div>
            </div>
            <div className="flex text-lg font-bold md:w-full">
              <div className="grow">Total</div>
              <div>{order && `$` + order.order[0].total}</div>
            </div>
          </div>
          <div className="flex max-w-xl grow flex-col">
            <div>
              <Heading title={'Address'}></Heading>
              <RowItem
                key={0}
                rowID={0}
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
                rowID={0}
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
                rowID={0}
                title=""
                subtitle="None selected"
                optionalNode={<SmallButton data={'Edit'} />}
                optionalNodeRightAligned
              />
            </div>
            <Link href="/order-management/post-checkout">
              <div
                onClick={handleClick}
                className="hover:border-green mt-10 w-full max-w-xs self-end overflow-hidden rounded border-2 border-solid border-green-light bg-green-light shadow-lg hover:border-4 hover:bg-green-hover hover:ring"
              >
                <div className="py-5 px-5 text-center">
                  <a className="xs:text-xs font-bold text-white hover:text-black lg:text-base">
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
