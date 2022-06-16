import type { NextPage } from 'next';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { supabase } from '../../utils/supabaseClient';

import SearchBar from '../../components/search/SearchBar';
import Loading from '../../components/common/Loading';

const SearchCategory: NextPage = () => {
  const CATEGORY_DISPLAY_LIMIT = 4; // the number of displayed dishes will be n + 1

  const termRef = useRef<HTMLInputElement>(null);

  const [isLoading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<Array<any>>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function getResult() {
      const { from, to } = getPagination(page, CATEGORY_DISPLAY_LIMIT);

      setLoading(true);

      const { data: categoryData, error: categoryError } = searchTerm
        ? await supabase
            .rpc('search_category', { category_term: searchTerm })
            .order('name')
            .range(from, to)
        : await supabase.from('Category').select().order('name').range(from, to);

      if (categoryError) throw categoryError.message;

      if (categoryData.length) {
        setResult([...result, ...categoryData]);
        setHasMore(true);
      } else {
        setHasMore(false);
      }

      setLoading(false);
    }

    getResult().catch((error) => console.error(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, page]);

  const getPagination = (page: number, size: number) => {
    const from = page ? page * (size + 1) : 0;
    const to = page ? from + size : size;

    return { from, to };
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      setSearchTerm(termRef.current!.value);
      setPage(0);
      setResult([]);
    }
  };

  const renderResults = () => {
    if (!isLoading && !result.length) {
      return (
        <div className="col-span-2 md:col-span-3 flex flex-col justify-center items-center w-full">
          <h2 className="text-2xl font-semibold">No category found</h2>
          <p className="text-lg mt-3">Please try with another search term</p>
        </div>
      );
    }

    return result.map((category: any) => (
      <div key={category.id} className="w-full">
        <Link href={`/search/category/${category.name}`}>
          <a className="flex flex-col items-center border shadow-md md:flex-row bg-white hover:bg-gray-100 active:bg-gray-200">
            <div className="relative w-full md:w-28 h-20 rounded-t-lg">
              <Image src="/images/dishMgt.jpg" alt={category.name} layout="fill" priority={true} />
            </div>
            <div className="flex flex-col justify-between p-4 -leading-normal">
              <h5 className="mb-2 text-xl text-black font-bold tracking-tight">{category.name}</h5>
            </div>
          </a>
        </Link>
      </div>
    ));
  };

  return (
    <>
      <Head>
        <title>Search By Category</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="flex flex-col justify-center items-center w-full py-32">
        <SearchBar
          placeholder="Search by category name..."
          termRef={termRef}
          handleKeyPress={handleKeyPress}
        />
        <div className="grid w-2/3 gap-10 grid-cols-2 md:grid-cols-3 mt-11">{renderResults()}</div>
        {isLoading ? (
          <Loading />
        ) : (
          hasMore && (
            <button
              className="text-white font-semibold text-xl px-6 py-1 mt-10 rounded-lg border-green-light hover:border-green-hover bg-green-light hover:bg-green-hover"
              onClick={() => setPage(page + 1)}
            >
              Show more
            </button>
          )
        )}
      </div>
    </>
  );
};

export default SearchCategory;
