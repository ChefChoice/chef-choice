import type { NextPage } from 'next';
import SignIn from './signin';

import { useUser } from '../lib/UserContext';
import MainMenu from './main-menu';

const Home: NextPage = () => {
  const { user } = useUser();

  return <>{user ? <MainMenu /> : <SignIn />}</>;
};

export default Home;
