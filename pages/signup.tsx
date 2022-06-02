// pages/signin.tsx

import { supabase } from '../utils/supabaseClient';
import { ChangeEvent, FormEvent, useState } from 'react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
      throw error;
    }
  };

  // TODO: Add password re-entry for verification
  return (
    <>
      <div className="bg-gray-200 max-w-screen-2xl flex h-screen mx-auto">
        <div className="max-w-sm m-auto bg-white px-4 py-4">
          <div className="px-1 mb-4">
            <p className="text-2xl font-sans font-bold">Register</p>
          </div>
          <form onSubmit={handleSubmit} className="mb-2">
            <input
              className="w-full rounded px-3 py-2 mb-4 bg-gray-200 border-gray-200 border-2 hover:border-green-light focus:outline-none focus:bg-white focus:border-green-light"
              placeholder="Email Address"
              id="input-email"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full rounded px-3 py-2 mb-2 bg-gray-200 border-gray-200 border-2 hover:border-green-light focus:outline-none focus:bg-white focus:border-green-light"
              placeholder="Password"
              id="input-password"
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            <button
              className="block max-w-sm bg-green-light hover:bg-green-hover border-green-light hover:border-green-hover py-2 px-2 text-white rounded w-full"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
