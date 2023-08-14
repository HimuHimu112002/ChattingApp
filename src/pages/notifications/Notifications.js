import React, {useEffect, useState} from 'react'
import Sidebar from '../../components/Sidebar'
import { useSelector,useDispatch } from 'react-redux';
import { getDatabase, ref, onValue } from "firebase/database";
import { counts } from '../../slices/UserSlices'
import { IoIosNotifications } from 'react-icons/io';
const Notifications = () => {

  let db = getDatabase();
  const dispatch = useDispatch()
  let data = useSelector((state)=> state.userLoginInfo.userInfo);
  let [notification, setnotification] = useState([])
  let [count1, setcount] = useState(0)

    useEffect(()=>{
      const FriendRequestRef = ref(db, 'Friendrequest');
      onValue(FriendRequestRef, (snapshot) => {
      let friendRequestarry = [];
      snapshot.forEach((item)=>{
          if(item.val().rechiverId == data.uid){
              friendRequestarry.push({...item.val()})
              // je friend request pathaise tar all information asbe and tar key tao asbe
          }
          //Just item.val() rakhle nijei nijeke request pathano hoiye jai but nije nijeke kokhono request pathano jaina
      })
      setnotification(friendRequestarry)
      setcount(friendRequestarry.length)
      localStorage.setItem("countnoti",JSON.stringify(friendRequestarry.length))
    });
  },[])

  dispatch(counts(count1++))
  
  return (

    notification == "" ?

    (<div className='lg:flex justify-between justify-items-center'>
      <div className='w-[150px] ml-2'>
        <Sidebar active="notifications"></Sidebar>
      </div>

      <div className='w-[300px] mt-5'>
        <h1 className='m-5 bg-[#e2dfdf] text-center py-5 text-3xl inline-block w-[250px] w-auto lg:w-[900px] font-dm font-semibold w-auto px-3'>You Don't Have a Notifications</h1>

      </div>      
    </div>)
    
    :
    <div className='lg:flex justify-between justify-items-center'>

      <div className='w-[150px] ml-2'>
        <Sidebar active="notifications"></Sidebar>
      </div>

      <div className='w-auto mt-5'>
        {notification.map((item)=>(
          <div className='flex bg-[#e2dfdf] inline-block w-[900px] mt-2 px-6 mx-5 py-4 rounded-md border border-solid border-[#bdb9b9]'>
          <p className='text-3xl font-dm font-semibold mt-1 mr-5'><IoIosNotifications></IoIosNotifications></p>
          <p className='text-2xl font-dm font-semibold'>{item.notification}</p>

          </div>
        ))}

      </div>           
    </div>

   
  )
}

export default Notifications