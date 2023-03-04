import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import {Link } from "react-router-dom";
import Search from './Search'
import { singleSms } from '../slices/UserSlices';

const GroupList = () => {
    const db = getDatabase();
    const dispatch = useDispatch()

    let data = useSelector((state)=> state.userLoginInfo.userInfo);
    let [GroupList, setGroupList] = useState([])
    let [joinmember, setjoinmember] = useState([])

    // Group List show start ===========

    useEffect(()=>{
        const GroupRef = ref(db, 'Group');
        onValue(GroupRef, (snapshot) => {
        let grouprry = [];
        snapshot.forEach((item)=>{
            if(data.uid != item.val().AdminId){
                // condition holo joid current login use id and admin id mile tahole show korbe
                // karon je login thakbe sei admin
                grouprry.push({...item.val(), key: item.key})
            }
        })
        setGroupList(grouprry)
    });
    },[])

     // Group List show end ===========

     // Group List join start ===========

    let handleJoin = (item)=>{
        set(push(ref(db, 'GroupJoinRequest')), {
            GroupId: item.key,
            GroupName: item.GroupName,
            GroupTag: item.GroupTag,
            AdminId: item.AdminId,
            AdminName: item.AdminName,
            UserId: data.uid,
            UserName: data.displayName,
        })
    }

    // Group List join end ===========

    // group sms start
    let handlegroupsms = (item)=>{
        console.log(item)
        dispatch(singleSms({status:"group", AdminId:item.AdminId, name:item.GroupName, GroupId:item.key,}))
        // localStorage.setItem("active", JSON.stringify({status:"groupSms", id:item.senderId, name:item.senderName}))
    }
    // group sms end
    
  return (
    <div className='shadow-lg w-full relative border mt-8 px-5 py-3 rounded-lg h-[347px] overflow-y-scroll'>
        <div className='flex justify-between'>
            <h3 className='text-xl font-semibold font-popin text-black'>Groups List</h3>
            <h1 className='mr-4 bg-heading px-4 py-1 text-white rounded-sm font-popin font-medium text-sm'><Link to="/groupCreate">Create a group</Link> </h1>
        </div>
        <Search></Search>
        <BsThreeDotsVertical className='absolute top-[15px] right-2'></BsThreeDotsVertical>


        {GroupList.map(item=>(
            <div onClick={()=>handlegroupsms(item)} className='flex gap-x-5 items-center border-b border-solid border-loginbtn pb-3.5'>
            <div>
                <img className='w-[70px] h-[70px] rounded-full mt-4' src='image/friend.png'></img>
            </div>

            <div className='text-left'>
                <h4 className='font-popin font-semibold text-sm text-black'>{item.GroupName}</h4>
                <p className='font-popin font-medium text-xs text-[#4D4D4D]'>{item.GroupTag}</p>
                <p className='font-popin font-bold text-xs text-heading'>Admin Name : {item.AdminName}</p>
            </div>
            <div className='mx-auto'>
                <button onClick={()=>handleJoin(item)} className='font-popin font-bold text-white text-sm bg-heading px-5 py-1 rounded-md hover:bg-green-500 hover:text-white duration-500'>Join</button>
            </div>
                
            </div>
        ))}
        
    </div>
  )
}

export default GroupList