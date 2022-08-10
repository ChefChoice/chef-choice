import PencilAltIcon from '@heroicons/react/outline/PencilAltIcon';
import TrashIcon from '@heroicons/react/outline/TrashIcon';
import { User, withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import Heading from '../../components/common/Heading';
import Modal from '../../components/modals/Modal';
import ContentContainer from '../../components/orders/ContentContainer';
import { supabase } from '../../utils/supabaseClient';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUser } from '../../lib/UserContext';
import Stars from '../../components/common/Stars';

const schema = yup
  .object()
  .shape({
    content: yup.string().required('Required'),
    rating: yup.number().min(1).max(5).integer().required('Required'),
  })
  .required();

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
  async getServerSideProps(ctx: any) {
    const homechef_id = ctx.params.slug;
    try {
      let { data: homeChef, error: homechefError } = await supabase
        .from('HomeChef')
        .select(`id, name`)
        .eq('id', homechef_id);

      if (homechefError) throw homechefError;

      let { data: review, error } = await supabase
        .from('Review')
        .select(`id, consumer:consumer_id(id, name), time_posted, time_edited, content, rating`)
        .eq('homechef_id', homechef_id);

      if (error) throw error.message;

      return {
        props: { review, homeChef: homeChef?.[0] },
      };
    } catch (e) {
      throw e;
    }
  },
});

const Review: NextPage = ({ review, homeChef }: any) => {
  const { user: userSession, isHomeChef } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [reviewId, setReviewId] = useState(-1);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(-1);

  const {
    register: addReviewRegister,
    handleSubmit: addReviewHandleSubmit,
    formState: { errors: addReviewErrors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const {
    register: editReviewRegister,
    handleSubmit: editReviewHandleSubmit,
    formState: { errors: editReviewErrors },
    reset,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setUser(supabase.auth.user());
  }, [user, isHomeChef]);

  const onAddReviewSubmit = async (data: any) => {
    let { error } = await supabase.from('Review').insert([
      {
        homechef_id: homeChef.id,
        consumer_id: user?.id,
        content: data.content,
        rating: data.rating,
      },
    ]);
    if (error) throw error;
    setAddModal(false);
    Router.reload();
  };

  const onEditReviewSubmit = async (data: any) => {
    let { error } = await supabase
      .from('Review')
      .update([
        {
          content: data.content,
          rating: data.rating,
          time_edited: new Date(),
        },
      ])
      .eq('id', reviewId);
    if (error) throw error;
    setEditModal(false);
    Router.reload();
  };

  async function deleteReview() {
    let { error } = await supabase.from('Review').delete().eq('id', reviewId);
    if (error) throw error;
    Router.reload();
    setDeleteModal(false);
  }

  return (
    <>
      <Head>
        <title>Review</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <ContentContainer>
        <div>
          <Heading
            title={`${homeChef.name} - Reviews`}
            optionalNode={
              !isHomeChef ? (
                <div className="flex space-x-2">
                  <Link href={`/kitchen/${homeChef.id}`}>
                    <button className="rounded border-2 border-solid border-black bg-white py-1 px-8 text-lg font-medium hover:ring">
                      Back to Dishes
                    </button>
                  </Link>
                  <button
                    onClick={() => setAddModal(true)}
                    className="rounded border-2 border-solid border-black bg-white py-1 px-8 text-lg font-medium hover:ring"
                  >
                    Add Review
                  </button>
                </div>
              ) : (
                <Link href="/marketplace">
                  <button className="rounded border-2 border-solid border-black bg-white py-1 px-8 text-lg font-medium hover:ring">
                    Back to Marketplace
                  </button>
                </Link>
              )
            }
            optionalNodeRightAligned={true}
          />
          {review.map((review: any) => (
            <div key={review.id}>
              <div className="flex place-content-between">
                <div className="">
                  <span className="font-semibold">{review.consumer.name}</span>{' '}
                </div>
                <div className="flex">
                  <Stars stars={review.rating} />
                </div>
              </div>
              <div className="flex">
                <div className="text-sm">
                  {new Date(review.time_posted).toDateString()}{' '}
                  {review.time_edited && (
                    <span>(Edited: {new Date(review.time_edited).toDateString()})</span>
                  )}
                </div>
              </div>
              <div className="flex place-content-between">
                <div className="">{review.content}</div>
                {review.consumer.id === user?.id && (
                  <div className="ml-auto grid grid-flow-col grid-rows-2 space-x-2 sm:grid-rows-1">
                    <button
                      onClick={() => {
                        setReviewId(review.id);
                        const defaultValues = { content: review.content, rating: review.rating };
                        reset(defaultValues);
                        setEditModal(true);
                      }}
                    >
                      <a className="" title="Edit">
                        <PencilAltIcon className="h-6 w-6" />
                      </a>
                    </button>
                    <button
                      onClick={() => {
                        setReviewId(review.id);
                        setDeleteModal(true);
                      }}
                    >
                      <a className="" title="Delete">
                        <TrashIcon className="h-6 w-6" />
                      </a>
                    </button>
                  </div>
                )}
              </div>
              <hr className="m-4" />
            </div>
          ))}
        </div>
      </ContentContainer>
      <Modal
        visible={deleteModal}
        title={'Confirm Deletion'}
        content={<p className="mx-2 mb-4 break-all text-lg">Do you want to delete this review?</p>}
        leftBtnText={'Delete'}
        leftBtnOnClick={deleteReview}
        rightBtnText={'Cancel'}
        rightBtnOnClick={() => setDeleteModal(false)}
        hideLeftBtn={false}
      />
      <div className={addModal ? 'block' : 'hidden'}>
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-20">
          <div className="m-3 flex flex-col rounded-lg bg-white p-6 md:w-4/5">
            <div className="flex flex-col">
              <Heading title={'Add Review'} />
              <form onSubmit={addReviewHandleSubmit(onAddReviewSubmit)}>
                <div className="mb-4">
                  <label className="mb-1 block">Details</label>
                  <textarea
                    {...addReviewRegister('content')}
                    className={`${
                      !addReviewErrors.content ? 'input-text-default' : 'input-text-error'
                    }`}
                    placeholder="Review..."
                  />
                  <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                    {addReviewErrors.content?.message}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="mb-1 block">Rating</label>
                  <input
                    {...addReviewRegister('rating')}
                    className={`${
                      !addReviewErrors.rating ? 'input-text-default' : 'input-text-error'
                    }`}
                    placeholder="Rate 1-5"
                    type="number"
                    min="1"
                    max="5"
                  />
                  <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                    {addReviewErrors.rating?.message}
                  </div>
                </div>
                <button className="input-submit" type="submit">
                  Submit
                </button>
              </form>
              <button
                className="input-submit mt-2 bg-red-700 text-white hover:bg-red-500 hover:ring hover:ring-red-400"
                onClick={() => setAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={editModal ? 'block' : 'hidden'}>
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-20">
          <div className="m-3 flex flex-col rounded-lg bg-white p-6 md:w-4/5">
            <div className="flex flex-col">
              <Heading title={'Add Review'} />
              <form onSubmit={editReviewHandleSubmit(onEditReviewSubmit)}>
                <div className="mb-4">
                  <label className="mb-1 block">Details</label>
                  <textarea
                    {...editReviewRegister('content')}
                    className={`${
                      !editReviewErrors.content ? 'input-text-default' : 'input-text-error'
                    }`}
                    placeholder="Review..."
                    defaultValue={reviewContent}
                  />
                  <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                    {editReviewErrors.content?.message}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="mb-1 block">Rating</label>
                  <input
                    {...editReviewRegister('rating')}
                    className={`${
                      !editReviewErrors.rating ? 'input-text-default' : 'input-text-error'
                    }`}
                    placeholder="Rate 1-5"
                    type="number"
                    min="1"
                    max="5"
                    defaultValue={reviewRating}
                  />
                  <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                    {editReviewErrors.rating?.message}
                  </div>
                </div>
                <button className="input-submit" type="submit">
                  Submit
                </button>
              </form>
              <button
                className="input-submit mt-2 bg-red-700 text-white hover:bg-red-500 hover:ring hover:ring-red-400"
                onClick={() => setEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Review;
