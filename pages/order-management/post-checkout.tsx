import type { NextPage } from 'next';
import { useState, useEffect } from 'react';

import Head from 'next/head';

import { supabase } from '../../utils/supabaseClient';
import ContentContainer from '../../components/orders/ContentContainer';

const orderID = 1;

const PostCheckout: NextPage = () => {
  // TODO: Once the order is approved, change the screen.

  const [orders, setOrders] = useState<Array<any> | null>(null);

  useEffect(() => {
    const getData = async () => {
      let { data: Order, error: OrderError } = await supabase
        .from('Order')
        .select('*')
        .eq('ORDER_ID', orderID)
        .eq('ORDER_STATUS', 'O');

      if (OrderError) throw OrderError.message;
      setOrders(Order);
    };

    getData().catch(console.error); // TODO: Remove the console error
  }, []);

  if (orders) {
    console.log(orders);
  }

  return (
    <>
      <Head>
        <title>Post Checkout</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <ContentContainer>
        <div className="md:w-full flex gap-2 pt-5 justify-center">
          <div className="py-5 px-5">
            {orders && orders?.length > 0 ? (
              <span>Order being prepared!</span>
            ) : (
              <span>Order sent to Home Chef pending approval!!!</span>
            )}
          </div>
        </div>
      </ContentContainer>
    </>
  );
};

export default PostCheckout;
