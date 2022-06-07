import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

import { supabase } from '../../utils/supabaseClient';

import RowItem from '../../components/common/RowItem';
import Heading from '../../components/common/Heading';
import ContentContainer from '../../components/orders/ContentContainer';

const Orders: NextPage = () => {
  const [pendingOrders, setPendingOrders] = useState<Array<any> | null>(null);
  const [orders, setOrders] = useState<Array<any> | null>(null);

  useEffect(() => {
    const getData = async () => {
      let { data: PendingOrder, error: PendingOrderError } = await supabase
        .from('Order')
        .select('*')
        .eq('ORDER_STATUS', 'P');

      if (PendingOrderError) throw PendingOrderError.message;
      setPendingOrders(PendingOrder);

      let { data: Order, error: OrderError } = await supabase
        .from('Order')
        .select('*')
        .eq('ORDER_STATUS', 'O');

      if (OrderError) throw OrderError.message;
      setOrders(Order);
    };

    getData().catch(console.error); // TODO: Remove the console error
  }, []);

  const handleClick: any = async (e: any) => {
    const { data, error } = await supabase
      .from('Order')
      .update({ ORDER_STATUS: 'O' })
      .eq('ORDER_ID', e);
  };

  const handleCancelClick: any = async (e: any) => {
    const { data, error } = await supabase
      .from('Order')
      .update({ ORDER_STATUS: 'C' })
      .eq('ORDER_ID', e);
  };

  return (
    <>
      <Head>
        <title>Orders</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <ContentContainer>
        <div>
          <Heading title={'Pending Orders'}></Heading>
          <div className="md:w-full">
            {pendingOrders?.map((order, i) => (
              <div key={i} className="flex py-2">
                <div className="grow">
                  <RowItem key={i} rowID={i} title={`#${order.ORDER_ID}`}></RowItem>
                </div>
                <div
                  onClick={() => handleClick(order.ORDER_ID)}
                  className="max-w-xs w-full bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-4 hover:border-green hover:ring hover:bg-green-hover"
                >
                  <div className="py-2 px-2 text-center">
                    <a className="font-bold text-white lg:text-base xs:text-xs hover:text-black">
                      Accept Order
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Heading title={'Ongoing Orders'}></Heading>
          <div className="md:w-full">
            {orders?.map((order, i) => (
              <div key={i} className="flex py-2">
                <div className="grow">
                  <RowItem key={i} rowID={i} title={`#${order.ORDER_ID}`}></RowItem>
                </div>
                <div
                  onClick={() => handleCancelClick(order.ORDER_ID)}
                  className="max-w-xs w-full bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-4 hover:border-green hover:ring hover:bg-green-hover"
                >
                  <div className="py-2 px-2 text-center">
                    <a className="font-bold text-white lg:text-base xs:text-xs hover:text-black">
                      Cancel Order
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ContentContainer>
    </>
  );
};

export default Orders;
