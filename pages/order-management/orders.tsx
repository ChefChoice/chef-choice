import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';

import { supabase } from '../../utils/supabaseClient';
import { getOrders } from '../../utils/fetchUtils';

import RowItem from '../../components/common/RowItem';
import Heading from '../../components/common/Heading';
import Loading from '../../components/common/Loading';
import ContentContainer from '../../components/orders/ContentContainer';
import SmallButton from '../../components/orders/SmallButton';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

const Orders: NextPage = () => {
  const [orders, setOrders] = useState<any | null>(null);
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    getOrders()
      .then((data) => {
        setOrders(data);
      })
      .catch(console.error);
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
        {orders ? (
          <>
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
                        className="hover:border-green w-full max-w-xs overflow-hidden rounded border-2 border-solid border-green-light bg-green-light shadow-lg hover:bg-green-hover hover:ring"
                      >
                        <div className="py-2 px-2 text-center">
                          <a className="xs:text-x font-bold text-white lg:text-base">
                            Cancel Order
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
                {orders &&
                  orders.ongoingOrders.map((order: any, i: number) => (
                    <div key={i} className="flex py-2">
                      <div className="grow">
                        <RowItem key={i} rowID={i} title={`#${order.id}`}></RowItem>
                      </div>
                      <div
                        onClick={() => handleClick(order.id)}
                        className="hover:border-green w-full max-w-xs overflow-hidden rounded border-2 border-solid border-green-light bg-green-light shadow-lg hover:bg-green-hover hover:ring"
                      >
                        <div className="py-2 px-2 text-center">
                          <a className="xs:text-xs font-bold text-white lg:text-base">
                            View Details
                          </a>
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
                        className="hover:border-green w-full max-w-xs overflow-hidden rounded border-2 border-solid border-green-light bg-green-light shadow-lg hover:bg-green-hover hover:ring"
                      >
                        <div className="py-2 px-2 text-center">
                          <a className="xs:text-xs font-bold text-white lg:text-base">
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        ) : (
          <Loading />
        )}
      </ContentContainer>
    </>
  );
};

export default Orders;
