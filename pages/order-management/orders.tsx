import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

import { supabase } from '../../utils/supabaseClient';
import { getOrders } from '../../utils/fetchUtils';

import RowItem from '../../components/common/RowItem';
import Heading from '../../components/common/Heading';
import ContentContainer from '../../components/orders/ContentContainer';
import SmallButton from '../../components/orders/SmallButton';

const Orders: NextPage = () => {
  const [orders, setOrders] = useState<any | null>(null);
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    getOrders()
      .then((data) => {
        setOrders(data);
      })
      .catch(console.error); // TODO: Remove the console error
  }, [refresh]);

  const handleCancelClick: any = async (e: any) => {
    const { data, error } = await supabase.from('Order').update({ status: 'C' }).eq('id', e);
    setRefresh(refresh + 1);
  };

  const handleClick: any = async (e: any) => {
    console.log(e);
  };

  return (
    <>
      <Head>
        <title>Orders</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <ContentContainer>
        <div>
          <div className="w-40" onClick={() => setRefresh(refresh + 1)}>
            <SmallButton data={'Refresh'} />
          </div>
          <Heading title={'Pending Orders'}></Heading>
          <div className="md:w-full">
            {orders &&
              orders.pendingOrders.map((order: any, i: number) => (
                <div key={i} className="flex py-2">
                  <div className="grow">
                    <RowItem key={i} rowID={i} title={`#${order.id}`}></RowItem>
                  </div>
                  <div
                    onClick={() => handleCancelClick(order.id)}
                    className="max-w-xs w-full bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-green hover:ring hover:bg-green-hover"
                  >
                    <div className="py-2 px-2 text-center">
                      <a className="font-bold text-white lg:text-base xs:text-x">Cancel Order</a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div>
          <Heading title={'Ongoing Orders'}></Heading>
          <div className="md:w-full">
            {orders &&
              orders.ongoingOrders.map((order: any, i: number) => (
                <div key={i} className="flex py-2">
                  <div className="grow">
                    <RowItem key={i} rowID={i} title={`#${order.id}`}></RowItem>
                  </div>
                  <div
                    onClick={() => handleClick(order.id)}
                    className="max-w-xs w-full bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-green hover:ring hover:bg-green-hover"
                  >
                    <div className="py-2 px-2 text-center">
                      <a className="font-bold text-white lg:text-base xs:text-xs">View Details</a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div>
          <Heading title={'Past Orders'}></Heading>
          <div className="md:w-full">
            {orders &&
              orders.pastOrders.map((order: any, i: number) => (
                <div key={i} className="flex py-2">
                  <div className="grow">
                    <RowItem key={i} rowID={i} title={`#${order.id}`}></RowItem>
                  </div>
                  <div
                    onClick={() => handleClick(order.id)}
                    className="max-w-xs w-full bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-green hover:ring hover:bg-green-hover"
                  >
                    <div className="py-2 px-2 text-center">
                      <a className="font-bold text-white lg:text-base xs:text-xs">View Details</a>
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
