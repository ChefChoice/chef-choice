import Link from 'next/link';

import Logo from './Logo';

const Footer = () => {
  return (
    <div className="flex max-w-screen-2xl mx-auto px-20 py-12 bg-white h-80">
      <div className="w-1/2 min-w-fit border-r-2 border-black">
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
      </div>
      <div className="flex flex-col justify-between w-1/2 min-w-fit px-20 text-black font-normal text-lg">
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
              <Link href="">
                <a>Private Policy</a>
              </Link>
            </li>
            <li>
              <Link href="">
                <a>Terms and Conditions</a>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="text-right">© 2022 ChefChoice</div>
      </div>
    </div>
  );
};

export default Footer;
