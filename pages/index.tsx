import type { NextPage } from 'next';
import { supabase } from '../utils/supabaseClient';
import { useState, useEffect } from 'react';
import SignIn from './signin';

const Home: NextPage = () => {
  const user = supabase.auth.user();

  // placeholder for demonstrating user account management
  const [testID, setTestID] = useState<any>('');
  useEffect(() => {
    user ? setTestID(user?.email) : 'unregistered user';
  }, [user]);

  return (
    <>
      {user ? (
        <div className="bg-gray-200 max-w-screen-2xl flex h-screen mx-auto">
          <div className="max-w-sm m-auto bg-white px-4 py-4">
            <p>Welcome back, {testID}</p>
          </div>
        </div>
      ) : (
        <SignIn />
      )}
    </>
  );
};

export default Home;
