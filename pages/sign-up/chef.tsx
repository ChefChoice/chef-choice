// pages/sign-up/chef.tsx

import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Head from 'next/head';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur', resolver: yupResolver(schema) });

  const router = useRouter();

  const onSubmit = async (data: any) => {
    const { error: userError } = await supabase.auth.signUp(
      { email: data.email, password: data.password },
      {
        data: {
          type: 'chef',
          name: data.firstName.concat(' ', data.lastName),
        },
      }
    );

    if (userError) {
      alert(userError.message);
      console.log(userError);
      throw userError;
    } else {
      router.push('./success');
    }
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
              <div className="mb-2 flex-wrap">
                <label className="ml-1 mb-1 block text-gray-500">Upload Food Certificate</label>
                <input
                  className="mb-4 w-full rounded border-2 border-gray-200 px-3 py-2"
                  placeholder="Upload Food Certificate"
                  id="input-certificate"
                  type="file"
                  {...register('certificate')}
                />
              </div>
              <button className="input-submit" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
