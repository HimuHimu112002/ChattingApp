import React from 'react'
import Sidebar from '../../components/Sidebar'
import { Link, useNavigate } from 'react-router-dom';
const Setting = () => {
  return (
    <div className='flex justify-between justify-items-center'>
        <>
        <div className='w-[150px] ml-2'>
          <Sidebar active="setting"></Sidebar>
        </div>

        <div className='w-[427px]'>
          <h1>Himu</h1>
        </div>

        <div className='w-[344px]'>
          ssssssssssssss
        </div>

        <div className='w-[344px]'>
          sssssssssssssssssssss
        </div>
        </>        
    </div>
  )
}

export default Setting