// pages/signin.tsx

import { supabase } from '../utils/supabaseClient';
import { useState } from 'react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
      throw error;
    }
  };

  return (
    <>
      <div className="bg-gray-200 max-w-screen-2xl flex h-screen mx-auto">
        <div className="max-w-sm m-auto bg-white px-4 py-4">
          <div className="px-1 mb-4">
            <p className="text-2xl font-sans font-bold">Register</p>
          </div>
          <form onSubmit={handleSubmit} className="mb-2">
            <input
              className="w-full rounded px-3 py-2 mb-4 bg-gray-200 border-gray-200 border-2 hover:border-green-700 focus:outline-none focus:bg-white focus:border-green-700"
              placeholder="Email Address"
              id="input-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full rounded px-3 py-2 mb-2 bg-gray-200 border-gray-200 border-2 hover:border-green-700 focus:outline-none focus:bg-white focus:border-green-700"
              placeholder="Password"
              id="input-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mb-4">
              <p className="text-sm font-semibold text-blue-500 hover:text-blue-900">
                <a href="">Forgot your password?</a>
              </p>
            </div>
            <button
              className="block max-w-sm bg-green-700 hover:bg-green-900 border-green-700 hover:border-green-900 py-2 px-2 text-white rounded w-full"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      ;
    </>
  );
}
