import React from 'react'
import Sidebar from '../../components/Sidebar'
//import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineHome, AiOutlineSetting, AiOutlineMessage } from 'react-icons/ai';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { MdCloudUpload } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import { CiLogin } from 'react-icons/ci';
import { getAuth, signOut,updateProfile } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { LineWave } from  'react-loader-spinner'
import { useDispatch, useSelector } from 'react-redux';
import { userLoginInfo } from '../../slices/UserSlices';
//import { profile } from '../../slices/UserSlices';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getStorage, ref as sto, uploadString, getDownloadURL } from "firebase/storage";
import { getDatabase, ref, onValue, set, push } from "firebase/database";

const Setting = () => {
  const db = getDatabase();
  const auth = getAuth();
  const storage = getStorage();
  let navigatee = useNavigate();
  let dispatch = useDispatch();

  let data = useSelector((state)=> state.userLoginInfo.userInfo);
  // database theke profile pic access korar system
  //let activeName = useSelector((state)=>state.userLoginInfo.countnoti)
  // logout handle
  let handleLogout = () =>{
    signOut(auth).then(() => {
      dispatch(userLoginInfo(null))
      localStorage.removeItem("userInfo")
      navigatee("/login");
    })
  }
  return (
    <div className='flex justify-between justify-items-center'>
        
        <div className='w-[150px] ml-2'>
          <Sidebar active="setting"></Sidebar>
        </div>

        <div className='w-[427px]'>
        
        <div onClick={handleLogout} className='cursor-pointer text-center mt-48 relative z-[1] after:z-[-1] after:bg-none after:w-[107px] after:h-[75px] after:content-[""] after:absolute after:top-[-14px] after:left-0 after:rounded-tl-md after:rounded-bl-md before:w-[8px] before:h-[99px] before:content-[""] before:bg-none before:absolute before:top-[-14px] before:right-[-36px] before:rounded-tl-md before:rounded-bl-md shadow-lg py-5'>
        <h2 className='text-2xl mb-3 text-center'>Logout Here</h2> <CiLogin className='text-5xl text-[#000] mx-auto'></CiLogin>
        </div>
        </div>

        <div className='w-[344px]'></div>
        <div className='w-[344px]'></div>
              
    </div>
  )
}

export default Setting