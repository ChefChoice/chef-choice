import type { NextPage } from 'next';
import { supabase } from '../utils/supabaseClient';
import router, { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const Home: NextPage = () => {
  // placeholder for demonstrating user account management
  const [welcomeMessage, setWelcomeMessage] = useState(
    'Welcome! Please click the Login button to proceed.'
  );
  useEffect(() => {
    const user = supabase.auth.user();
    if (user) setWelcomeMessage(`Welcome back, ${user.id}`);
  }, []);

  return (
    <>
      <div className="bg-gray-200 max-w-screen-2xl flex h-screen mx-auto">
        <div className="max-w-sm m-auto bg-white px-4 py-4">
          <div>{welcomeMessage}</div>
          <div>
            <Link href="">
              <a
                onClick={async (e) => {
                  e.preventDefault();
                  const { error } = await supabase.auth.signOut();
                  if (error) {
                    document.getElementById('loginErrorField')!.innerHTML = error.message;
                    throw error;
                  }
                  router.push('/signin');
                }}
                className="text-white font-semibold text-xl px-6 py-1 mr-2 border-none rounded-lg border-green-light hover:border-green-hover bg-green-light hover:bg-green-hover"
              >
                Logout
              </a>
            </Link>
            <Link href="/profile">
              <a className="text-white font-semibold text-xl px-6 py-1 border-none rounded-lg border-green-light hover:border-green-hover bg-green-light hover:bg-green-hover">
                Profile
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
