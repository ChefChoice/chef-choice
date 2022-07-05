import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';

import Head from 'next/head';
import Image from 'next/image';
import Heading from '../../components/common/Heading';
import RowItem from '../../components/common/RowItem';
import Loading from '../../components/common/Loading';
import ContentContainer from '../../components/orders/ContentContainer';
import SmallButton from '../../components/orders/SmallButton';
import Stars from '../../components/common/Stars';
import Modal from '../../components/orders/Modal';
import { PROMPT } from '../../utils/constants';
import Link from 'next/link';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
  async getServerSideProps(ctx: any) {
    const slug = ctx.params.slug;

    return {
      props: {
        page: slug || null,
      },
    };
  },
});

const Kitchen: NextPage = ({ page }: any) => {
  const [data, setData] = useState<any | null>(null);
  const [modalOn, setModalOn] = useState<boolean>(false);
  const [choice, setChoice] = useState<boolean>(false);
  const [warning, setWarning] = useState<boolean>(false);
  const [dish, setDish] = useState<any | null>(null);

  useEffect(() => {
    getKitchen(page)
      .then((data) => {
        setData(data);
      })
      .catch(console.error);
  }, [page]);

  useEffect(() => {
    if (choice) {
      addToOrder(dish.dish_id, dish.user_id, warning);
      setChoice(false);
      setWarning(false);
    }
    // eslint-disable-next-line
  }, [choice]);

  const getKitchen = async (chefId: string) => {
    try {
      const response = await axios.get(`/api/kitchen/${chefId}`);

      return response.data.kitchen;
    } catch (error) {
      console.error(error);
    }
  };

  const addToOrder = async (dishId: string | null, homeChefId: string | null, warning: boolean) => {
    try {
      axios
        .post('/api/order-management/item', {
          dishId,
          homeChefId,
          warning,
        })
        .then((response) => {
          if (response.data.warning) {
            setDish({ ...dish, prompt: PROMPT.WARNING });
            setModalOn(true);
          } else {
            // TODO: Refresh the Navbar
          }
        });
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        {data ? <title>Chef {data.HomeChef[0].name}</title> : <title>Chef ...</title>}
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <ContentContainer>
        {data.HomeChef.length !== 0 ? (
          <>
            <div className="flex flex-col gap-y-4 lg:flex-row">
              {data && <h3 className="pr-5 text-4xl font-bold">Chef {data.HomeChef[0].name}</h3>}
              <div
                className=""
                onClick={() => {
                  console.log('view schedule');
                }}
              >
                <SmallButton data={'View Schedule'} />
              </div>
              <Link href={`/review/${data.HomeChef[0].id}`}>
                <button className="rounded border-2 border-solid border-black bg-white py-1 px-8 text-lg font-medium hover:ring hover:ring-green-light">
                  Reviews
                </button>
              </Link>
              <Stars stars={data ? data.HomeChef[0].rating : 0} />
            </div>
            <div>100 Queen St W, Toronto, ON M5H 2N1</div> {/* TODO: Temporary hard-coded value */}
            <div className="flex grow flex-col pt-5">
              {/* TODO: Make heading below dynamic */}
              <Heading title={'Dinner'}></Heading>
              {/* TODO: Add scrollbar */}
              <div>
                {data &&
                  data.Dishes.map((dish: any) => (
                    <div key={dish.dish_id}>
                      <RowItem
                        key={dish.dish_id}
                        rowID={dish.dish_id}
                        title={dish.dish_name}
                        image={
                          <Image
                            src={data.PublicURL + dish.dish_image}
                            alt={dish.dish_name}
                            width={100}
                            height={100}
                          ></Image>
                        }
                        optionalNode={
                          <div className="gap-4 md:flex">
                            <div>{`$${dish.dish_price}`}</div>
                            <div
                              onClick={() => {
                                setDish({ ...dish });
                                setModalOn(true);
                              }}
                            >
                              <SmallButton data={'Add to Order'} />
                            </div>
                          </div>
                        }
                        optionalNodeRightAligned
                      />
                    </div>
                  ))}
              </div>
            </div>
            {modalOn && (
              <Modal
                setModalOn={setModalOn}
                setChoice={setChoice}
                setWarning={setWarning}
                title={dish.dish_name}
                description={dish.dish_description}
                prompt={dish.prompt}
                price={dish.dish_price}
              />
            )}
          </>
        ) : (
          <div>Kitchen not found</div>
        )}
      </ContentContainer>
    </>
  );
};

export default Kitchen;
