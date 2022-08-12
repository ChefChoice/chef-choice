import { useState, useEffect, useReducer } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { useUser } from '../../lib/UserContext';

import { ORDER_TYPE } from '../../utils/constants';
import { Order } from '../../models/models';

import Heading from '../../components/common/Heading';
import Loading from '../../components/common/Loading';
import ContentContainer from '../../components/orders/ContentContainer';
import SmallButton from '../../components/orders/SmallButton';
import OrderList from '../../components/orders/OrderList';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

function reducer(state: any, action: any) {
  switch (action.type) {
    case ORDER_TYPE.PENDING_ORDERS:
      return { type: action.type, orders: action.results };
    case ORDER_TYPE.ONGOING_ORDERS:
      return { type: action.type, orders: action.results };
    case ORDER_TYPE.PAST_ORDERS:
      return { type: action.type, orders: action.results };
    default:
      return state;
  }
}

const OrderManagement: NextPage = () => {
  const [refresh, setRefresh] = useState<number>(0);
  const [state, dispatch] = useReducer(reducer, { type: ORDER_TYPE.PENDING_ORDERS, orders: [] });
  const { isHomeChef } = useUser();

  useEffect(() => {
    getOrders('P').then((orders: Order[]) => {
      const filteredOrders = orders.filter((order: Order) => order.cart == false);
      dispatch({ type: ORDER_TYPE.PENDING_ORDERS, results: filteredOrders });
    });
  }, [refresh]);

  const getOrders = async (status: string) => {
    try {
      const response = await axios.get(`/api/order-management/orders/${status}`);

      return response.data.orders;
    } catch (error) {
      console.error(error);
    }
  };

  const handleTab = async (orderType: string) => {
    let status = '';
    switch (orderType) {
      case ORDER_TYPE.ONGOING_ORDERS:
        status = 'O';
        break;
      case ORDER_TYPE.PAST_ORDERS:
        status = 'F';
        break;
      case ORDER_TYPE.PENDING_ORDERS:
      default:
        status = 'P';
    }

    getOrders(status).then((orders: Order[]) => {
      const filteredOrders = orders.filter((order: Order) => order.cart == false);
      dispatch({ type: orderType, results: filteredOrders });
    });
  };

  return (
    <>
      <Head>
        <title>Orders</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <ContentContainer>
        {state.orders ? (
          <>
            <div className="mb-4 w-40" onClick={() => setRefresh(refresh + 1)}>
              <SmallButton data={'Refresh'} />
            </div>
            <div className="md:flex">
              {Object.values(ORDER_TYPE).map((orders: string, i) => {
                const element = [];

                element.push(
                  <div
                    key={0}
                    className="w-60 cursor-pointer"
                    style={{
                      color: state.type == orders ? 'black' : 'grey',
                    }}
                    onClick={() => handleTab(orders)}
                  >
                    <Heading title={orders} />
                  </div>
                );

                if (i != Object.values(ORDER_TYPE).length - 1) {
                  element.push(
                    <div key={1} className="text-3xl">
                      <div className="mb-3 hidden pr-10 md:block">|</div>
                      <hr className="border-t-2 border-black/[.50]" />
                    </div>
                  );
                }

                return (
                  <div key={i} className="flex">
                    {element}
                  </div>
                );
              })}

              <div className="grow text-3xl">
                <hr className="mt-12 border-t-2 border-black/[.50]" />
              </div>
            </div>
            <div className="flex gap-20 font-bold">
              <div className="w-20 text-xl">Order #</div>
              <div className="w-30 text-xl">Date</div>
              <div className="w-20 text-xl">Total</div>
            </div>
            {state.orders && (
              <OrderList
                isHomeChef={isHomeChef}
                type={state.type}
                orders={state.orders}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            )}
          </>
        ) : (
          <Loading />
        )}
      </ContentContainer>
    </>
  );
};

export default OrderManagement;
