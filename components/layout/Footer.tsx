import Link from 'next/link';

import Logo from './Logo';

const Footer = () => {
  return (
    <div className="h-84 mx-auto bg-white py-12 pl-7 md:flex md:max-w-screen-2xl md:px-20">
      <div className="min-w-fit md:w-1/2 md:border-r-2 md:border-black">
        <Link href="/">
          <a className="text-xl">
            <Logo />
          </a>
        </Link>
      </div>
      <div className="mt-4 flex-col justify-between text-lg font-normal text-black md:mt-0 md:flex md:w-1/2 md:min-w-fit md:px-20">
        <nav>
          <ul className="flex flex-col justify-start gap-3 ">
            <li>
              <Link href="/">
                <a>Help Desk</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Getting Started</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>About Us</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Private Policy</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Terms and Conditions</a>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="my-4 md:text-right">© 2022 ChefChoice</div>
      </div>
    </div>
  );
};

export default Footer;
