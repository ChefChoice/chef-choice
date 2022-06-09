// TODO: Maybe move this page to [slug].js of orders or ongoing orders.

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';

import Head from 'next/head';

import { supabase } from '../../utils/supabaseClient';
import ContentContainer from '../../components/orders/ContentContainer';
import SmallButton from '../../components/orders/SmallButton';

const orderID = 1; // TODO: Temporary hard-coded value until Context

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

const PostCheckout: NextPage = () => {
  const [orders, setOrders] = useState<Array<any> | null>(null);
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    getData().catch(console.error); // TODO: Remove the console error
  }, [refresh]);

  const getData = async () => {
    let { data: Order, error: OrderError } = await supabase
      .from('Order')
      .select('*')
      .eq('id', orderID)
      .eq('status', 'O');

    if (OrderError) throw OrderError.message;
    setOrders(Order);
  };

  return (
    <>
      <Head>
        <title>Post Checkout</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <ContentContainer>
        <div className="w-40" onClick={() => setRefresh(refresh + 1)}>
          <SmallButton data={'Refresh'} />
        </div>
        <div className="flex justify-center gap-2 pt-5 md:w-full">
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
