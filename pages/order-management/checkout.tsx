import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { ClockIcon, CreditCardIcon, LocationMarkerIcon } from '@heroicons/react/outline';

import RowItem from '../../components/common/RowItem';
import Heading from '../../components/common/Heading';
import Loading from '../../components/common/Loading';
import CartItem from '../../components/orders/CartItem';
import ContentContainer from '../../components/orders/ContentContainer';
import SmallButton from '../../components/orders/SmallButton';
import { useRouter } from 'next/router';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

const Checkout: NextPage = () => {
  const [order, setOrder] = useState<any | null>(null);
  const [refresh, setRefresh] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    getData().catch(console.error);
  }, [refresh]);

  const getData = async () => {
    const order = await axios
      .get('/api/order-management/checkout')
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw Error('Server Error');
      });
    setOrder(order);
  };

  const handleClick = async () => {
    axios
      .post('/api/order-management/checkout', { id: order.order[0].id })
      .then(() => {
        router.push('/order-management');
      })
      .catch((err) => {
        throw Error('Server Error');
      });
  };

  if (!order) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Checkout</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <ContentContainer>
        {order !== -1 ? (
          <>
            <h3 className="text-4xl font-bold">Chef {order.order[0].HomeChef.name}</h3>
            <div className="mx-auto flex flex-col gap-x-16 pt-6 lg:flex-row">
              <div className="grow">
                <Heading title={'Your Items'}></Heading>
                <div className="md:w-full">
                  {order &&
                    order.orderDish?.map((orderDish: any, i: number) => (
                      <CartItem
                        key={i}
                        quantity={orderDish.quantity}
                        title={orderDish.Dish.dish_name}
                        price={(
                          Math.round(orderDish.Dish.dish_price * orderDish.quantity * 100) / 100
                        ).toFixed(2)}
                        orderDish={orderDish}
                        setRefresh={setRefresh}
                        refresh={refresh}
                      ></CartItem>
                    ))}
                </div>
                <div className="flex font-semibold md:w-full">
                  <div className="grow">Subtotal</div>
                  <div>{order && `$` + order.order[0].subtotal.toFixed(2)}</div>
                </div>
                <div className="flex md:w-full">
                  <div className="grow">Tax and Fees (HST 13%)</div>
                  <div>{order && `$` + order.order[0].fees.toFixed(2)}</div>
                </div>
                <div className="flex text-lg font-bold md:w-full">
                  <div className="grow">Total</div>
                  <div>{order && `$` + order.order[0].total.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex grow flex-col lg:max-w-xl">
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
                        optionalNode={<SmallButton data={'Edit'} />}
                        optionalNodeRightAligned
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Heading title={'Payment'}></Heading>
                  <div className="flex">
                    <CreditCardIcon className="h-8 w-8 stroke-2 pr-2" />
                    <div className="grow">
                      <RowItem
                        key={0}
                        rowID={0}
                        title=""
                        subtitle="Mastercard ending in #5463"
                        optionalNode={<SmallButton data={'Edit'} />}
                        optionalNodeRightAligned
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Heading title={'Scheduled Time'}></Heading>
                  <div className="flex">
                    <ClockIcon className="h-8 w-8 stroke-2 pr-2" />
                    <div className="grow">
                      <RowItem
                        key={0}
                        rowID={0}
                        title=""
                        subtitle="None selected"
                        optionalNode={<SmallButton data={'Edit'} />}
                        optionalNodeRightAligned
                      />
                    </div>
                  </div>
                </div>
                <div
                  onClick={handleClick}
                  className="hover:border-green mt-10 w-full max-w-xs cursor-pointer self-end overflow-hidden rounded border-2 border-solid border-green-light bg-green-light shadow-lg hover:border-4 hover:bg-green-hover hover:ring"
                >
                  <div className="py-5 px-5 text-center">
                    <a className="xs:text-xs font-bold text-white hover:text-black lg:text-base">
                      Place Order
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>{`There's nothing in your cart`}</div>
        )}
      </ContentContainer>
    </>
  );
};

export default Checkout;
