// pages/sign-up/chef.tsx

import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Head from 'next/head';
import { useState } from 'react';
import axios from 'axios';

const schema = yup
  .object()
  .shape({
    firstName: yup.string().required('Required'),
    lastName: yup.string().required('Required'),
    email: yup.string().email('Invalid Email Address').required('Required'),
    password: yup.string().min(8, 'Must be 8 characters or longer').required('Required'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  })
  .required();

export default function SignUp() {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur', resolver: yupResolver(schema) });

  const router = useRouter();

  const onSubmit = async (data: any) => {
    await axios
      .post(`/api/sign-up/chef`, { data })
      .then((response) => {
        router.push(response.data.customerUrl);
      })
      .catch((err) => {
        alert(err.message);
        console.log(err);
        throw err;
      });
  };

  return (
    <>
      <Head>
        <title>Chef Sign Up - CHEFCHOICE</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <main>
        <div className="w-screen bg-default bg-cover py-1 sm:flex sm:h-screen sm:justify-center sm:gap-4">
          <div className="mx-2 mt-1 mb-2 self-start bg-white px-4 py-4 sm:my-10 sm:w-96">
            <h1 className="mb-4 font-sans text-4xl font-bold">
              Customers are now within your reach
            </h1>
            <span className="font-sans text-base">
              <span className="font-bold">CHEFCHOICE</span> gives you the flexibility, visibility
              and insight you need to connect with more customers. Partner with us today!
            </span>
          </div>
          <div className="mx-2 mb-1 self-start bg-white px-4 py-4 sm:my-10 sm:w-96">
            <div className="mb-4 px-1">
              <p className="font-sans text-2xl font-bold">Get Started</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="-mx-2 mb-3 flex flex-wrap">
                <div className="w-full px-2 sm:w-1/2">
                  <input
                    {...register('firstName')}
                    className={`${!errors.firstName ? 'input-text-default' : 'input-text-error'}`}
                    placeholder="First Name"
                    type="text"
                  />
                  <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                    {errors.firstName?.message}
                  </div>
                </div>
                <div className="w-full px-2 sm:w-1/2">
                  <input
                    {...register('lastName')}
                    className={`${!errors.lastName ? 'input-text-default' : 'input-text-error'}`}
                    placeholder="Last Name"
                    type="text"
                  />
                  <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                    {errors.lastName?.message}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <input
                  {...register('email')}
                  className={`${!errors.email ? 'input-text-default' : 'input-text-error'}`}
                  placeholder="Email Address"
                  type="email"
                />
                <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                  {errors.email?.message}
                </div>
              </div>
              <div className="mb-4">
                <input
                  {...register('password')}
                  className={`${!errors.password ? 'input-text-default' : 'input-text-error'}`}
                  placeholder="Password"
                  type="password"
                />
                <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                  {errors.password?.message}
                </div>
              </div>
              <div className="mb-4">
                <input
                  {...register('confirmPassword')}
                  className={`${
                    !errors.confirmPassword ? 'input-text-default' : 'input-text-error'
                  }`}
                  placeholder="Confirm Password"
                  type="password"
                />
                <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                  {errors.confirmPassword?.message}
                </div>
              </div>
              <button className="input-submit" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
        <div className={showModal ? 'block' : 'hidden'}>
          <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-20">
            <div className="m-3 flex flex-col rounded-lg bg-white p-3">
              <div className="flex flex-col">
                <p className="m-3 text-lg">{modalMessage}</p>
                <div className="m-2 text-center">
                  <button
                    className="mx-3 rounded border-2 border-black bg-white px-5 py-1 text-black hover:bg-gray-600 hover:text-white"
                    onClick={() => {
                      setShowModal(false);
                      router.push('./success');
                    }}
                  >
                    Okay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
