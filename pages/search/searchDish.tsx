import type { NextPage } from 'next';

import Head from 'next/head';
import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { supabase } from '../../utils/supabaseClient';

import SearchBar from '../../components/search/SearchBar';
import SearchRow from '../../components/search/SearchRow';

const SearchDish: NextPage = () => {
  const DISH_IMAGE_PUBLIC_URL =
    'https://nwcvvpfhfsturkjenths.supabase.co/storage/v1/object/public/dish-images';

  const termRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<Array<any>>([]);

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      setSearchTerm(termRef.current!.value);
    }
  };

  useEffect(() => {
    async function getResult() {
      const { data: dishData, error: dishError } = await supabase
        .from('dishinfo')
        .select()
        .textSearch('dish_name', `${searchTerm}`)
        .order('dish_name');

      if (dishError) throw dishError.message;
      if (dishData) setResult(dishData);
    }

    getResult();
  }, [searchTerm]);

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
        <div className="grid w-2/3 gap-10 grid-cols-1 mt-11">
          {result.length ? (
            result.map((dish: any) => (
              <SearchRow
                key={dish.dish_id}
                dishId={dish.dish_id}
                dishName={dish.dish_name}
                dishPrice={dish.dish_price}
                chefName={dish.name}
                href="#"
                imageSrc={`${DISH_IMAGE_PUBLIC_URL}/${dish.dish_image}`}
              />
            ))
          ) : (
            <div className="flex flex-col justify-center items-center w-full">
              <h2 className="text-2xl font-semibold">No items found</h2>
              <p className="text-lg mt-3">Please try with another search term</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchDish;
