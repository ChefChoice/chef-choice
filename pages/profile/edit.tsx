import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '@supabase/supabase-js';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Heading from '../../components/common/Heading';
import { supabase } from '../../utils/supabaseClient';
import { useUser } from '../../lib/UserContext';

const emailSchema = yup
  .object()
  .shape({
    email: yup.string().email('Invalid Email Address').required('Required'),
    confirmEmail: yup.string().oneOf([yup.ref('email'), null], 'Emails must match'),
  })
  .required();

const passwordSchema = yup
  .object()
  .shape({
    currentPassword: yup.string().required('Required'),
    password: yup.string().min(8, 'Must be 8 characters or longer').required('Required'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  })
  .required();

const userSchema = yup
  .object()
  .shape({
    phoneNo: yup.string().required('Required'),
    street: yup.string().required('Required'),
    city: yup.string().required('Required'),
    postalCode: yup
      .string()
      .matches(
        /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
        'Invalid Postal Code Format'
      )
      .required('Required'),
  })
  .required();

export default function Edit() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>();
  const { user: userSession, isHomeChef } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const {
    register: emailFormRegister,
    handleSubmit: emailFormHandleSubmit,
    formState: { errors: emailFormErrors },
  } = useForm({ mode: 'onBlur', resolver: yupResolver(emailSchema) });

  const {
    register: passwordFormRegister,
    handleSubmit: passwordFormHandleSubmit,
    formState: { errors: passwordFormErrors },
  } = useForm({ mode: 'onBlur', resolver: yupResolver(passwordSchema) });

  const {
    register: userFormRegister,
    handleSubmit: userFormHandleSubmit,
    formState: { errors: userFormErrors },
    reset,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(userSchema),
  });

  const onEmailSubmit = async (data: any) => {
    const { data: emailData, error: emailError } = await supabase.auth.update({
      email: data.email,
    });

    if (emailError) throw emailError.message;
    console.log(emailData);
    setModalMessage('Please check your email to confirm this change.');
    setShowModal(true);
  };

  const onPasswordSubmit = async (data: any) => {
    const { data: passwordConfirmData, error: passwordConfirmError } = await supabase.rpc(
      'check_current_password',
      { current_password: data.currentPassword }
    );
    if (passwordConfirmError) {
      console.log(passwordConfirmError.message);
      setModalMessage(passwordConfirmError.message);
      setShowModal(true);
    } else {
      const { data: passwordData, error: passwordError } = await supabase.auth.update({
        password: data.password,
      });

      if (passwordError) throw passwordError.message;
      console.log(passwordData);
      setModalMessage('Password changed successfully!');
      setShowModal(true);
    }
  };

  const onUserSubmit = async (data: any) => {
    const { data: submitData, error } = await supabase
      .from('Address')
      .update({
        street: data.street,
        city: data.city,
        postalcode: data.postalCode,
        province: 'Ontario',
        country: 'Canada',
      })
      .eq('id', userData?.address_id);
    if (error) throw error.message;
    console.log(submitData);
    if (isHomeChef) {
      if (!(data.phoneNo === userData?.phoneno)) {
        console.log(data?.phoneNo);
        console.log(userData?.phoneno);
        const { data: phoneData, error: phoneError } = await supabase
          .from('HomeChef')
          .update({
            phoneno: data?.phoneNo,
          })
          .eq('id', userData?.id);
        if (phoneError) console.log(phoneError.message);
        console.log(phoneData);
      }
    } else {
      if (!(data.phoneNo === userData?.phoneno)) {
        const { data: phoneData, error: phoneError } = await supabase
          .from('Consumer')
          .update({
            phoneno: data?.phoneNo,
          })
          .eq('id', userData?.id);
        if (phoneError) console.log(phoneError.message);
        console.log(phoneData);
      }
    }
    setModalMessage('Information updated successfully!');
    setShowModal(true);
  };

  const getData = useCallback(async () => {
    setUser(supabase.auth.user());
    if (user) {
      setUser(user);
      if (isHomeChef) {
        const { data: homeChefData, error: homeChefError } = await supabase
          .from('HomeChef')
          .select(`*, address:address_id(*)`)
          .eq('id', user.id);

        if (homeChefError) throw homeChefError.message;
        if (homeChefData) {
          setUserData(homeChefData[0]);
          console.log(homeChefData);

          const defaultValues = {
            phoneNo: userData?.phoneno,
            street: userData?.address.street,
            city: userData?.address.city,
            postalCode: userData?.address.postalcode,
          };
          reset(defaultValues);
        }
      } else {
        const { data: consumerData, error: consumerError } = await supabase
          .from('Consumer')
          .select(`*, address:address_id(*)`)
          .eq('id', user.id);

        if (consumerError) throw consumerError.message;
        if (consumerData) {
          setUserData(consumerData[0]);
          console.log(consumerData);

          const defaultValues = {
            phoneNo: userData?.phoneno,
            street: userData?.address.street,
            city: userData?.address.city,
            postalCode: userData?.address.postalcode,
          };
          reset(defaultValues);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    getData();
  }, [user, getData, showModal]);

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <main className="m-auto my-20 flex min-h-screen w-full max-w-7xl flex-col space-y-10">
        <div>
          <Heading title={'Edit Profile'} />
          <form onSubmit={emailFormHandleSubmit(onEmailSubmit)} className="mb-4 ml-4">
            <div>
              <div className={`col-span-8 lg:justify-self-start`}>
                <p className="text-2xl">Email Address</p>
              </div>
              <hr className="mb-5 border-t-2 border-black/[.50]" />
            </div>
            <div className="mb-2 w-1/4">
              <label className="mb-1 block">Current</label>
              <input
                className="input-text-disabled border-gray-500 bg-gray-500 text-white"
                defaultValue={user?.email}
                type="text"
                disabled
              />
              <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                {emailFormErrors.name?.message}
              </div>
            </div>
            <div className="mb-2 w-1/4">
              <label className="mb-1 block">New Email Address</label>
              <input
                {...emailFormRegister('email')}
                className={`${!emailFormErrors.email ? 'input-text-default' : 'input-text-error'}`}
                type="email"
              />
              <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                {emailFormErrors.email?.message}
              </div>
            </div>
            <div className="mb-2 w-1/4">
              <label className="mb-1 block">Confirm Email Address</label>
              <input
                {...emailFormRegister('confirmEmail')}
                className={`${
                  !emailFormErrors.confirmEmail ? 'input-text-default' : 'input-text-error'
                }`}
                type="email"
              />
              <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                {emailFormErrors.confirmEmail?.message}
              </div>
            </div>
            <button className="input-submit w-1/4" type="submit">
              Submit
            </button>
          </form>

          <form onSubmit={passwordFormHandleSubmit(onPasswordSubmit)} className="mb-4 ml-4">
            <div>
              <div className={`col-span-8 lg:justify-self-start`}>
                <p className="text-2xl">Change Password</p>
              </div>
              <hr className="mb-5 border-t-2 border-black/[.50]" />
            </div>
            <div className="mb-2 w-1/4">
              <label className="mb-1 block">Current Password</label>
              <input
                {...passwordFormRegister('currentPassword')}
                className={`${
                  !passwordFormErrors.currentPassword ? 'input-text-default' : 'input-text-error'
                }`}
                type="password"
              />
              <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                {passwordFormErrors.currentPassword?.message}
              </div>
            </div>
            <div className="mb-2 w-1/4">
              <label className="mb-1 block">New Password</label>
              <input
                {...passwordFormRegister('password')}
                className={`${
                  !passwordFormErrors.password ? 'input-text-default' : 'input-text-error'
                }`}
                type="password"
              />
              <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                {passwordFormErrors.password?.message}
              </div>
            </div>
            <div className="mb-2 w-1/4">
              <label className="mb-1 block">Confirm Password</label>
              <input
                {...passwordFormRegister('confirmPassword')}
                className={`${
                  !passwordFormErrors.confirmPassword ? 'input-text-default' : 'input-text-error'
                }`}
                type="password"
              />
              <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                {passwordFormErrors.confirmPassword?.message}
              </div>
            </div>
            <button className="input-submit w-1/4" type="submit">
              Submit
            </button>
          </form>

          <form onSubmit={userFormHandleSubmit(onUserSubmit)} className="mb-4 ml-4">
            <div>
              <div className={`col-span-8 lg:justify-self-start`}>
                <p className="text-2xl">User Information</p>
              </div>
              <hr className="mb-5 border-t-2 border-black/[.50]" />
            </div>
            <div className="mb-2 w-1/4">
              <label className="mb-1 block">Phone Number</label>
              <input
                {...userFormRegister('phoneNo')}
                className={`${!userFormErrors.phoneNo ? 'input-text-default' : 'input-text-error'}`}
                defaultValue={userData?.phoneno}
                type="text"
              />
              <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                {userFormErrors.phoneNo?.message}
              </div>
            </div>
            <div className="mb-2 w-1/4">
              <label className="mb-1 block">Street Address</label>
              <input
                {...userFormRegister('street')}
                className={`${!userFormErrors.street ? 'input-text-default' : 'input-text-error'}`}
                defaultValue={userData?.address.street}
                type="text"
              />
              <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                {userFormErrors.street?.message}
              </div>
            </div>
            <div className="mb-2 w-1/4">
              <label className="mb-1 block">City</label>
              <input
                {...userFormRegister('city')}
                className={`${!userFormErrors.city ? 'input-text-default' : 'input-text-error'}`}
                defaultValue={userData?.address.city}
                type="text"
              />
              <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                {userFormErrors.city?.message}
              </div>
            </div>
            <div className="mb-2 w-1/4">
              <label className="mb-1 block">Postal Code</label>
              <input
                {...userFormRegister('postalCode')}
                className={`${
                  !userFormErrors.postalCode ? 'input-text-default' : 'input-text-error'
                }`}
                defaultValue={userData?.address.postalcode}
                type="text"
              />
              <div className="ml-1 mt-1 text-xs font-semibold text-red-400">
                {userFormErrors.postalCode?.message}
              </div>
            </div>
            <button className="input-submit w-1/4" type="submit">
              Submit
            </button>
          </form>
        </div>
        <div className={showModal ? 'block' : 'hidden'}>
          <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-20">
            <div className="m-3 flex flex-col rounded-lg bg-white p-3">
              <div className="flex flex-col">
                <p className="m-3 text-lg">{modalMessage}</p>
                <div className="m-2 text-center">
                  <button
                    className="mx-3 rounded border-2 border-black bg-white px-5 py-1 text-black hover:bg-gray-600 hover:text-white"
                    onClick={() => setShowModal(false)}
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
