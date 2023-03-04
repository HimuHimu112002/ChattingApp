import React from 'react'
import { BiSearch } from 'react-icons/bi'; 
import { BsThreeDotsVertical } from 'react-icons/bs'; 
const Search = () => {
  return (
    <div className='relative'>
        <input className='mt-4 drop-shadow-md px-9 py-3 outline-0 rounded-lg w-full' type="text" placeholder='Search'></input>
        <BiSearch className='absolute top-[33px] left-3'></BiSearch>
        <BsThreeDotsVertical className='absolute top-[33px] right-3'></BsThreeDotsVertical>
    </div>
  )
}

export default Search