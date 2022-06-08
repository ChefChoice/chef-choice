import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { supabase } from '../../utils/supabaseClient';

import CartItem from '../../components/orders/CartItem';
import RowItem from '../../components/common/RowItem';
import Heading from '../../components/common/Heading';
import ContentContainer from '../../components/orders/ContentContainer';
import SmallButton from '../../components/orders/SmallButton';

const orderID = 1; // TODO: Remove temporary hardcoded value

const Checkout: NextPage = () => {
  const [order, setOrder] = useState<Array<any> | null>(null);

  useEffect(() => {
    getData().catch(console.error);
  }, []);

  const getData = async () => {
    let { data: Order, error: OrderError } = await supabase
      .from('Order')
      .select(`*, "HomeChef" ("name")`)
      .eq('id', orderID);

    let { data: Order_Dish, error: OrderDishError } = await supabase
      .from('Order_Dish')
      .select(`*, "Dish" (dish_name, dish_price)`)
      .eq('order_id', orderID);

    if (OrderError) throw OrderError.message;
    if (OrderDishError) throw OrderDishError.message;

    setOrder([Order, Order_Dish]);
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
        {order && <h3 className="text-4xl font-bold">Chef {order[0][0].HomeChef.name}</h3>}
        <div className="flex gap-x-16 mx-auto pt-6">
          <div className="grow">
            <Heading title={'Your Items'}></Heading>
            <div className="md:w-full">
              {order &&
                order[1]?.map((orderDish: any, i: any) => (
                  <CartItem
                    key={i}
                    quantity={orderDish.quantity}
                    title={orderDish.Dish.dish_name}
                    price={orderDish.Dish.dish_price * orderDish.quantity}
                  ></CartItem>
                ))}
            </div>
            <div className="flex md:w-full font-semibold">
              <div className="grow">SubTotal</div>
              <div>{order && `$` + order[0][0].subtotal}</div>
            </div>
            <div className="flex md:w-full">
              <div className="grow">Tax and Fees</div>
              <div>{order && `$` + order[0][0].fees}</div>
            </div>
            <div className="flex md:w-full font-bold text-lg">
              <div className="grow">Total</div>
              <div>{order && `$` + order[0][0].total}</div>
            </div>
          </div>
          <div className="grow flex flex-col max-w-xl">
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
