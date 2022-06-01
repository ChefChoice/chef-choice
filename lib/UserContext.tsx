import React, { useEffect, useState, createContext, useContext } from 'react';

const UserContext = createContext({ user: null, session: null });

export const UserContextProvider = (props: any) => {
  const { supabaseClient } = props;
  const [session, setSession] = useState<any[] | null>(null);
  const [user, setUser] = useState<any[] | null>(null);

  useEffect(() => {
    const session = supabaseClient.auth.session();
    setSession(session);
    setUser(session?.user ?? null);
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event: any, session: any) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
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
