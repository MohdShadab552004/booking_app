import { useState } from 'react';

const SearchBar = () => {
  const [search, setSearch] = useState("");

  return (
    <form
      className="
        flex gap-2.5 
        max-[500px]:flex-col 
        max-[500px]:w-full
      "
    >
      <input
        type="search"
        placeholder="Search experiences"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-[340px] py-3 px-4 bg-[#EDEDED] rounded-sm
          max-[500px]:w-full
        "
      />
      <button
        type="submit"
        className="
          px-5 py-3 font-medium text-[14px] bg-[#FFD643] rounded-lg 
          max-[500px]:w-full
        "
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
