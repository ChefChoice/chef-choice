// pages/signin.tsx

import { supabase } from '../utils/supabaseClient';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function SignIn() {
  const user = supabase.auth.user();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) {
      document.getElementById('loginErrorField')!.innerHTML = error.message;
      throw error;
    }
    if (user) {
      router.push('/main-menu');
    }
  };

  return (
    <>
      <Head>
        <title>Sign In</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <main>
        <div className="mx-auto flex h-screen w-screen bg-default bg-cover">
          <div className="m-auto max-w-sm bg-white px-4 py-4">
            <div className="mb-4 px-1">
              <p className="font-sans text-2xl font-bold">Welcome Back</p>
            </div>
            <form onSubmit={handleSubmit} className="mb-2">
              <input
                className="mb-4 w-full rounded border-2 border-gray-200 bg-gray-200 px-3 py-2 hover:border-green-light focus:border-green-light focus:bg-white focus:outline-none"
                placeholder="Email Address"
                id="input-email"
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                onFocus={(e: ChangeEvent<HTMLInputElement>) =>
                  (document.getElementById('loginErrorField')!.innerHTML = '')
                }
                required
              />
              <input
                className="mb-2 w-full rounded border-2 border-gray-200 bg-gray-200 px-3 py-2 hover:border-green-light focus:border-green-light focus:bg-white focus:outline-none"
                placeholder="Password"
                id="input-password"
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                onFocus={(e: ChangeEvent<HTMLInputElement>) =>
                  (document.getElementById('loginErrorField')!.innerHTML = '')
                }
              />
              <div className="mb-2">
                <p id="loginErrorField" className="text-sm font-semibold text-red-500"></p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-semibold text-blue-500 hover:text-blue-900">
                  <a href="">Forgot your password?</a>
                </p>
              </div>
              <button
                className="block w-full max-w-sm rounded border-green-light bg-green-light py-2 px-2 text-white hover:border-green-hover hover:bg-green-hover"
                type="submit"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
