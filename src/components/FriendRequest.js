import React, { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { useSelector } from 'react-redux';
import Search from './Search';
const FriendRequest = () => {
    const db = getDatabase();

    let data = useSelector((state)=> state.userLoginInfo.userInfo);
    let [FriendrequestList, setFriendrequestList] = useState([])

    // Friend Request show start =========== 

    useEffect(()=>{
        const FriendRequestRef = ref(db, 'Friendrequest');
        onValue(FriendRequestRef, (snapshot) => {
        let friendRequestarry = [];
        snapshot.forEach((item)=>{
            if(item.val().rechiverId == data.uid){
                friendRequestarry.push({...item.val(), id:item.key})
                // je friend request pathaise tar all information asbe and tar key tao asbe
            }
            //Just item.val() rakhle nijei nijeke request pathano hoiye jai but nije nijeke kokhono request pathano jaina
        })
        setFriendrequestList(friendRequestarry)
    });
    },[])

    // Friend Request show end =========== 

    // Accept Friend request so friend er all information item er maddhome anlam spreed use kore frist
    // accept hobe then remove hoiye jabe

    // Friend Request Accept start =========== 

    let handleFriendAccept = (item)=>{
        set(push(ref(db, 'FriendAccept')), {
            ...item,
        }).then(()=>{
            remove(ref(db, 'Friendrequest/' + item.id))
        });
    }

    // Friend Request Accept end ===========


    // handle Friend Request Delete =======================>
    let handledelete = (item)=>{
        remove(ref(db, 'Friendrequest/' + item.id))
        
    }

  return (
    <div className='shadow-lg w-full relative border mt-3 px-5 py-3 rounded-lg h-[462px] overflow-y-scroll'>
        <h3 className='text-xl font-semibold font-popin text-black'>Friend  Request</h3>
        <BsThreeDotsVertical className='absolute top-[15px] right-2'></BsThreeDotsVertical>
        <Search></Search>
        {FriendrequestList.map((item)=>(
            <div className='flex gap-x-5 items-center border-b border-solid border-loginbtn pb-3.5'>
            <div>
                <img className='w-[70px] h-[70px] rounded-full mt-4' src={data.photoURL}></img>
            </div>

            <div className='text-left'>
                <h4 className='font-popin font-semibold text-sm text-black'>{item.senderName}</h4>
                <p className='font-popin font-medium text-xs text-[#4D4D4D]'>Hello!</p>

                <div className='mx-auto'>
                    <button onClick={()=>handleFriendAccept(item)} className='font-popin font-bold text-white text-sm bg-grcolor px-5 py-1 rounded-md mr-1 mt-2'>Accept</button>
                    <button onClick={()=>handledelete(item)} className='font-popin font-bold text-white text-sm bg-rebbtn px-5 py-1 rounded-md mt-2'>Delete</button>
                </div>
            </div>
            </div>
        ))}
        
    </div>
  )
}

export default FriendRequest