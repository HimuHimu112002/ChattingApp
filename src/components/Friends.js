import React, { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { getDatabase, ref, onValue, set, remove, push} from "firebase/database";
import { useSelector, useDispatch } from 'react-redux';
import { singleSms } from '../slices/UserSlices';
import Swal from 'sweetalert2'

const Friends = () => {
    const db = getDatabase();
    let dispatch = useDispatch()
    let data = useSelector((state)=> state.userLoginInfo.userInfo);

    const [friend, setFriend] = useState([])

    // friend accept korle ui te show START CODE ======================

    useEffect(()=>{
        const friendRef = ref(db, 'FriendAccept');
        onValue(friendRef, (snapshot) => {
            let friendArray = []
            snapshot.forEach((item)=>{
                if(data.uid == item.val().rechiverId || data.uid == item.val().senderId){
                    // akhane current user hoi receved korbe r na hoi current user send korbe
                    friendArray.push({...item.val(), key:item.key})
                }
            })
            setFriend(friendArray)
        });
    }, [])

    // friend accept korle ui te show END CODE ======================


    // Friends block section START CODE ===============

    let handleBlock =(item)=>{
        if(data.uid == item.senderId){
            // current user block korbe rechiverId ke or rechiverId block korbe current user ke
            set(push(ref(db, 'block')), {
                block: item.rechiverName,
                blockId: item.rechiverId,
                blockby: item.senderName,
                blockbyId: item.senderId,
            }).then(()=>{
                remove(ref(db, "FriendAccept/"+ item.key))
            });
        }else{
            set(push(ref(db, 'block')), {
                block: item.senderName,
                blockId: item.senderId,
                blockby: item.rechiverName,
                blockbyId: item.rechiverId,
            }).then(()=>{
                remove(ref(db, "FriendAccept/"+ item.key))
            });
        }
    }

    // handle Friend Unfriend =======================>

    let handleUnFriend = ((item)=>{
        Swal.fire({
            title: 'Are you sure?',
            text: "Unfriend yours friends",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#162030',
            confirmButtonBorder: 'border-none',
            confirmButtonMarginTop: '10px',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            padding:"70px",
            }).then((result) => {
            if (result.isConfirmed) {
                remove(ref(db, "FriendAccept/"+ item.key))     
                Swal.fire(
                'Deleted!',
                'Your post has been deleted.',
                'success'
                )
            }
            })
    
    })

    let handleSingleSms =(item)=>{
        if(item.rechiverId == data.uid){
            dispatch(singleSms({status:"single",id:item.senderId, name:item.senderName} ))
            localStorage.setItem("active", JSON.stringify({status:"single", id:item.senderId, name:item.senderName}))
        }else{
            dispatch(singleSms({status:"single",id:item.rechiverId, name:item.rechiverName} ))
            localStorage.setItem("active", JSON.stringify({status:"single", id:item.rechiverId, name:item.rechiverName}))
        }
    }

    
  return (
    <div className='shadow-lg w-full relative border mt-3 px-5 py-3 rounded-lg h-[431px] overflow-y-scroll'>
        <h3 className='text-xl font-semibold font-popin text-black'>Friends</h3>
        <BsThreeDotsVertical className='absolute top-[15px] right-2'></BsThreeDotsVertical>

            {friend.map(item=>(
            <div onClick={()=>handleSingleSms(item)} className='flex gap-x-5 items-center border-b border-solid border-loginbtn pb-3.5 cursor-pointer'>
                <div>
                    <img className='w-[70px] h-[70px] rounded-full mt-4' src={data.photoURL}></img>
                </div>

                <div className='text-left'>
                    <h4 className='font-popin font-semibold text-sm text-black'>{data.uid == item.senderId ? item.rechiverName:item.senderName}</h4>

                    <div className='mx-auto flex'>
                        <button onClick={()=>handleUnFriend(item)} className='font-popin font-bold text-white text-sm bg-rebbtn px-5 py-1 rounded-md mr-1 mt-3'>Unfriend</button>
                        <button onClick={()=>handleBlock(item)} className='font-popin font-bold text-white text-sm bg-heading px-5 py-1 rounded-md mt-3'>Block</button>
                    </div>
                </div>
            </div>
        ))}

    </div>
  )
}

export default Friends