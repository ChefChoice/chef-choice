import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
// import '@fullcalendar/timeline/main.css';
// import '@fullcalendar/resource-timeline/main.css';

import type { AppProps } from 'next/app';
import { UserContextProvider } from '../lib/UserContext';
import '../styles/globals.css';
import { supabase } from '../utils/supabaseClient';

import Layout from '../components/layout/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider supabaseClient={supabase}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContextProvider>
  );
}

export default MyApp;
