import * as React from 'react';

import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="mt-[64px] md:mt-[68px]">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
