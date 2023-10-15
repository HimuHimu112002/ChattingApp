import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BlockAccount from '../../components/BlockAccount.js'
import FriendRequest from '../../components/FriendRequest.js'
import Friends from '../../components/Friends.js'
import GroupList from '../../components/GroupList.js'
import MyGroups from '../../components/MyGroups.js'
import Search from '../../components/Search.js'
import Sidebar from '../../components/Sidebar.js'
import UserList from '../../components/UserList.js'
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { useDispatch } from 'react-redux';
import { userLoginInfo } from '../../slices/UserSlices';

const Home = () => {
  let auth = getAuth();
  const dispatch = useDispatch();
  let [verify, setVerify] = useState(false)
  let navigate = useNavigate();

  let data = useSelector((state)=> state.userLoginInfo.userInfo)

  // for email verification check and handle
  onAuthStateChanged(auth, (user)=>{
    // onAuthStateChanged er kaj holo user er kothao changed hole onAuthStateChanged janai dibe
    // jemon emial false theke true hole user name change hole password change hole
    if(user.emailVerified){
      setVerify(true)
      dispatch(userLoginInfo(user))
      // local store data onAuthStateChanged update korbe karon onAuthStateChanged er maddhome
      // data changed hole ta redux and localstore data update korbe
      localStorage.setItem("userInfo",JSON.stringify(user))
    }
  })

  useEffect(()=> {
    if(!data){
      // data na thakl login asbe karon login na korle redux er majhe kono data thakbe 
      // se khetre condition true hobe and home page theke redirect kore login page asbe
      navigate("/login")
    }
  },[])
  
  return (

    <div className='lg:flex justify-items-center'>
        {verify ? 
        <>

        <div className='w-[150px] ml-2'>
          <Sidebar active="home"></Sidebar>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-4'>

          <div className='lg:w-full sm:w-auto mx-4'>
            {/* <Search></Search> */}
            {/* <GroupList></GroupList> */}
            <FriendRequest></FriendRequest>
          </div>

          <div className='lg:w-full sm:w-auto  mx-4'>
            <Friends></Friends>
            {/* <MyGroups></MyGroups> */}
          </div>

          <div className='lg:w-full sm:w-auto mx-4'>
            <UserList></UserList>
            {/* <BlockAccount></BlockAccount> */}
          </div>

          <div className='lg:w-full sm:w-auto mx-4'>
            {/* <UserList></UserList> */}
            <BlockAccount></BlockAccount>
          </div>
        </div>

        </>
        : <div className='bg-gradient-to-r from-purple-500 to-pink-500 w-full h-screen flex justify-center items-center text-center'>
            <h1 className='text-white text-5xl font-extrabold'>Please Verified Your Email Then Reload Your's Browser Window.</h1>
          </div>
        }
        
    </div>
  )
}

export default Home