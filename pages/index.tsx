import type { NextPage } from 'next';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const Home: NextPage = () => {
  const user = supabase.auth.user();
  const router = useRouter();

  // placeholder for demonstrating user account management
  const [testID, setTestID] = useState('');
  useEffect(() => {
    user ? setTestID(user.id) : 'unregistered user';
  }, [user]);

  return (
    <>
      <div className="bg-gray-200 max-w-screen-2xl flex h-screen mx-auto">
        <div className="max-w-sm m-auto bg-white px-4 py-4">
          <p>Welcome back, {testID}</p>
          <button
            className="block max-w-sm bg-green-700 hover:bg-green-900 border-green-700 hover:border-green-900 py-2 px-2 text-white rounded w-full"
            onClick={async (e) => {
              e.preventDefault();
              const { error } = await supabase.auth.signOut();
              if (error) {
                document.getElementById('loginErrorField')!.innerHTML = error.message;
                throw error;
              }
              router.push('/signin');
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
