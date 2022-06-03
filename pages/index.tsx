import type { NextPage } from 'next';
import SignIn from './signin';

import { useUser } from '../lib/UserContext';

const Home: NextPage = () => {
  const { user } = useUser();

  return (
    <>
      {user ? (
        <div className="bg-gray-200 max-w-screen-2xl flex h-screen mx-auto">
          <div className="max-w-sm m-auto bg-white px-4 py-4">
            <p>{`Welcome back, ${user['email']}`}</p>
          </div>
        </div>
      ) : (
        <SignIn />
      )}
    </>
  );
};

export default Home;
