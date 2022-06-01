import Link from 'next/link';

import Logo from './Logo';

const Navbar = () => {
  return (
    <div className="flex items-center max-w-screen-2xl mx-auto px-5 py-3 bg-white">
      <div className="mr-8">
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
      </div>

      <div className="flex items-center justify-between w-full">
        <nav>
          <ul>
            <li>
              <Link href="/">
                <a className="text-black font-semibold text-xl">Become a Chef</a>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-x-8">
          <Link href="/">
            <a className="text-black font-semibold text-xl">Help</a>
          </Link>
          <Link href="/signin">
            <a className="text-white font-semibold text-xl px-6 py-1 border-none rounded-lg bg-green-light">
              Log In
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
