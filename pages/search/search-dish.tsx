import type { NextPage } from 'next';

import Head from 'next/head';
import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { supabase } from '../../utils/supabaseClient';

import SearchBar from '../../components/search/SearchBar';
import SearchRow from '../../components/search/SearchRow';
import Loading from '../../components/common/Loading';

const SearchDish: NextPage = () => {
  const DISH_DISPLAY_LIMIT = 2; // the number of displayed dishes will be n + 1

  const termRef = useRef<HTMLInputElement>(null);

  const [isLoading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<Array<any>>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function getResult() {
      const { from, to } = getPagination(page, DISH_DISPLAY_LIMIT);

      setLoading(true);

      const { data: dishData, error: dishError } = searchTerm
        ? await supabase
            .rpc('search_dishes', { dish_term: searchTerm })
            .order('dish_name')
            .range(from, to)
        : await supabase.from('dishinfo').select().order('dish_name').range(from, to);

      if (dishError) throw dishError.message;

      if (dishData.length) {
        setResult([...result, ...dishData]);
        setHasMore(true);
      } else {
        setHasMore(false);
      }

      setLoading(false);
    }

    getResult();
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
        <div className="flex flex-col justify-center items-center w-full">
          <h2 className="text-2xl font-semibold">No items found</h2>
          <p className="text-lg mt-3">Please try with another search term</p>
        </div>
      );
    }

    return result.map((dish: any) => (
      <SearchRow
        key={dish.dish_id}
        dishId={dish.dish_id}
        dishName={dish.dish_name}
        dishPrice={dish.dish_price}
        chefName={dish.name}
        href="#"
        imageSrc={`${process.env.NEXT_PUBLIC_SUPABASE_DISH_STORAGE_URL}/${dish.dish_image}`}
      />
    ));
  };

  return (
    <>
      <Head>
        <title>Search By Dish</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="flex flex-col justify-center items-center w-full py-32">
        <SearchBar
          placeholder="Search by dish name..."
          termRef={termRef}
          handleKeyPress={handleKeyPress}
        />
        <div className="grid w-2/3 gap-10 grid-cols-1 mt-11">{renderResults()}</div>
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

export default SearchDish;
