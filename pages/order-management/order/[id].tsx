import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { CreditCardIcon, LocationMarkerIcon } from '@heroicons/react/outline';

import { useUser } from '../../../lib/UserContext';

import RowItem from '../../../components/common/RowItem';
import Heading from '../../../components/common/Heading';
import Loading from '../../../components/common/Loading';
import CartItem from '../../../components/orders/CartItem';
import ContentContainer from '../../../components/orders/ContentContainer';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
  async getServerSideProps(ctx: any) {
    const id = ctx.params.id;

    return {
      props: {
        page: id || null,
      },
    };
  },
});

const Order: NextPage = ({ page }: any) => {
  const [order, setOrder] = useState<any | null>(null);
  const { isHomeChef } = useUser();

  useEffect(() => {
    getData(page);
  }, [page]);

  const getData = async (page: any) => {
    const orderResult = await axios
      .get(`/api/order-management/order/${page}`)
      .then((response) => {
        if (response.data !== 200) {
          return response.data;
        }
      })
      .catch((err) => {
        console.error(err.message);
      });

    setOrder(!orderResult ? -1 : orderResult);
  };

  if (!order) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>{order && order !== -1 ? `Order #${order.order[0].id}` : `Order`}</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <ContentContainer>
        {order !== -1 ? (
          <>
            <h3 className="text-4xl font-bold">
              {isHomeChef
                ? `${order.order[0].Consumer.name}`
                : `Chef ${order.order[0].HomeChef.name}`}
            </h3>
            <h4 className="mt-5 text-3xl">Order #{order.order[0].id}</h4>
            <div className="mx-auto flex flex-col gap-x-16 pt-6 lg:flex-row">
              <div className="grow">
                <Heading title={isHomeChef ? 'Items' : 'Your Items'}></Heading>
                <div className="md:w-full">
                  {order &&
                    order.orderDish?.map((orderDish: any, i: number) => (
                      <CartItem
                        key={i}
                        quantity={orderDish.quantity}
                        title={orderDish.Dish.dish_name}
                        price={
                          Math.round(orderDish.Dish.dish_price * orderDish.quantity * 100) / 100
                        }
                        orderDish={orderDish}
                      ></CartItem>
                    ))}
                </div>
                <div className="flex font-semibold md:w-full">
                  <div className="grow">Subtotal</div>
                  <div>{order && `$` + order.order[0].subtotal}</div>
                </div>
                <div className="flex md:w-full">
                  <div className="grow">Tax and Fees (HST 13%)</div>
                  <div>{order && `$` + order.order[0].fees}</div>
                </div>
                <div className="flex text-lg font-bold md:w-full">
                  <div className="grow">Total</div>
                  <div>{order && `$` + order.order[0].total}</div>
                </div>
              </div>
              <div className="flex grow flex-col lg:max-w-xl">
                {!isHomeChef && (
                  <div>
                    <Heading title={'Address'}></Heading>
                    <div className="flex">
                      <LocationMarkerIcon className="h-8 w-8 stroke-2 pr-2" />
                      <div className="grow">
                        <RowItem
                          key={0}
                          rowID={0}
                          title=""
                          subtitle="100 Queen St W, Toronto, ON M5H 2N1"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <Heading title={isHomeChef ? 'Payout Method' : 'Payment'}></Heading>
                  <div className="flex">
                    <CreditCardIcon className="h-8 w-8 stroke-2 pr-2" />
                    <div className="grow">
                      <RowItem
                        key={0}
                        rowID={0}
                        title=""
                        subtitle={isHomeChef ? 'Account ending in 7890' : 'Visa ending in 4321'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>{`Order Not Found`}</div>
        )}
      </ContentContainer>
    </>
  );
};

export default Order;
