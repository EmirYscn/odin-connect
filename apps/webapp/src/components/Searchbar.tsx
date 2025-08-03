import { FaArrowLeft, FaSearch } from "react-icons/fa";

type SearchbarProps = {
  placeholder?: string;
  searchValue?: string;
  setSearchValue?: (value: string) => void;
};

function Searchbar({
  placeholder = "Search..",
  searchValue,
  setSearchValue,
}: SearchbarProps) {
  return (
    <div className="flex gap-4 items-center px-4 py-1 rounded-full border-1 border-[var(--color-grey-300)] focus-within:border-gray-500">
      <label
        htmlFor="searchbar"
        className="cursor-pointer text-[var(--color-grey-400)] focus:border-gray-500"
      >
        {searchValue ? <FaArrowLeft /> : <FaSearch />}
      </label>
      <input
        type="search"
        name="searchbar"
        id="searchbar"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue?.(e.target.value)}
        className="w-full focus:outline-none"
        autoComplete="off"
      />
    </div>
  );
}

export default Searchbar;
