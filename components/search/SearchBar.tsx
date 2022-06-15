import { SearchIcon } from '@heroicons/react/outline';
import { RefObject, KeyboardEventHandler } from 'react';

interface ISearchBarProps {
  placeholder: string;
  termRef: RefObject<HTMLInputElement>;
  handleKeyPress: KeyboardEventHandler;
}

const SearchBar = ({ placeholder, termRef, handleKeyPress }: ISearchBarProps) => {
  return (
    <>
      <div className="flex w-2/3 items-center">
        <div className="relative w-full">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <SearchIcon className="w-6 h-6 text-black" />
          </div>
          <input
            type="text"
            className="border-black border-b-2 text-black text-base block w-full pl-10 p-2.5 focus:border-white"
            placeholder={placeholder}
            ref={termRef}
            onKeyDown={handleKeyPress}
          />
        </div>
      </div>
    </>
  );
};

export default SearchBar;
