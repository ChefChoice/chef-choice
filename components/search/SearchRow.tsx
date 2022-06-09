import Link from 'next/link';
import Image from 'next/image';
import { string } from 'yup';

interface ISearchRowProps {
  href: string;
  imageSrc: string;
  dishId: string;
  dishName: string;
  dishPrice: string;
  chefName: string;
}

const SearchRow = ({ href, dishId, dishName, dishPrice, chefName }: ISearchRowProps) => {
  return (
    <div key={dishId} className="w-full">
      <Link href={href}>
        <a className="flex flex-col items-center border shadow-md md:flex-row bg-white hover:bg-gray-100 active:bg-gray-200">
          <div className="relative w-full h-96 rounded-t-lg md:h-40 md:w-48 md:rounded-none md:rounded-l-lg">
            <Image src="/images/dishMgt.jpg" alt={dishName} layout="fill" />
          </div>
          <div className="flex flex-col justify-between p-4 -leading-normal">
            <h5 className="mb-2 text-2xl text-black font-bold tracking-tight">{dishName}</h5>
            <p className="mb-3 font-small text-gray-900">Prepared by {chefName}</p>
            <p className="mb-3 font-normal text-gray-900">${dishPrice}</p>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default SearchRow;
