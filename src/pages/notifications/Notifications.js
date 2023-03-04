import React, {useEffect, useState} from 'react'
import Sidebar from '../../components/Sidebar'
import { useSelector,useDispatch } from 'react-redux';
import { getDatabase, ref, onValue } from "firebase/database";
import { counts } from '../../slices/UserSlices'

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
    <div className='flex justify-between justify-items-center'>
        <>
        <div className='w-[150px] ml-2'>
          <Sidebar active="notifications"></Sidebar>
        </div>
       
        <div className='w-full mt-5'>
        {notification.map((item)=>(
          <p className='bg-[#e2dfdf] inline-block w-[900px] mt-2 px-6 mx-5 py-4 font-dm font-semibold rounded-md border border-solid border-[#bdb9b9]'>{item.notification}</p>
        ))}
        </div>      
          
        </>        
    </div>
  )
}

export default Notifications