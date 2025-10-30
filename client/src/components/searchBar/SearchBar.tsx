import React, { useState } from 'react'

const SearchBar = () => {
    const [search,setSearch] = useState<string>("");
  return (
    <form className='flex gap-2.5'>
        <input
            type='search'
            placeholder='Search experiences'
            value={search}
            onChange={(e) => {
                setSearch(e.target.value)
            }}
            className='w-[340px] py-3 px-4 bg-[#EDEDED] rounded-sm'
        />
        <button className='px-5 py-3 font-medium text-[14px] bg-[#FFD643] rounded-lg'>Search</button>
        

    </form>
  )
}

export default SearchBar