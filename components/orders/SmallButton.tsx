import Link from 'next/link';

const SmallButton = ({ data }: { data: string }) => {
  return (
    <>
      <Link href="">
        <a>
          <div className="border border-solid rounded-md border-black px-10 py-1 text-center">
            {data}
          </div>
        </a>
      </Link>
    </>
  );
};

export default SmallButton;
