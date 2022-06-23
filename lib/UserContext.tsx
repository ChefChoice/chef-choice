import React, { useEffect, useState, createContext, useContext } from 'react';
import axios from 'axios';
import { supabase } from '../utils/supabaseClient';

const UserContext = createContext({ user: null, session: null, isHomeChef: null });

export const UserContextProvider = (props: any) => {
  const { supabaseClient } = props;
  const [session, setSession] = useState<any[] | null>(null);
  const [user, setUser] = useState<any[] | null>(null);
  const [isHomeChef, setIsHomeChef] = useState<boolean | null>(null);

  useEffect(() => {
    const session = supabaseClient.auth.session();

    setSession(session);
    setUser(session?.user ?? null);
    checkHomeChef().then((result) => {
      setIsHomeChef(result);
    });

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event: any, session: any) => {
        setSession(session);
        setUser(session?.user ?? null);
        axios.post('/api/auth/set-auth-cookie', { event: event, session: session });
        checkHomeChef().then((result) => {
          setIsHomeChef(result);
        });
      }
    );

    return () => {
      authListener.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  const value = {
    session,
    user,
    isHomeChef,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};

const checkHomeChef = async () => {
  const { data: HomeChef, error } = await supabase
    .from('HomeChef')
    .select('id')
    .eq('id', supabase.auth.user()?.id);

  return HomeChef?.length !== 0;
};
