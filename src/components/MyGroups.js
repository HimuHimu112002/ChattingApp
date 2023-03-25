import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import {Link } from "react-router-dom";
import  userLoginInfo  from '../slices/UserSlices';
import { groupr } from '../slices/UserSlices';
import { groupsms } from '../slices/UserSlices';
import { singleSms } from '../slices/UserSlices';
import Swal from 'sweetalert2'

const MyGroups = () => {
    const db = getDatabase();
    const dispatch = useDispatch()
    let data = useSelector((state)=> state.userLoginInfo.userInfo);

    let [myGroup, setmyGroup] = useState([])
    let [myGroupMember, setmyGroupMember] = useState([])
    let [show, setshow] = useState(false)

    // my Group List start ===========

    useEffect(()=>{
        const GroupRef = ref(db, 'Group');
        onValue(GroupRef, (snapshot) => {
        let grouprry = [];
        snapshot.forEach((item)=>{
            if(data.uid == item.val().AdminId){
                // condition holo joid current login use id and admin id mile tahole show korbe
                // karon je login thakbe sei admin 
                grouprry.push({...item.val(), key: item.key})
            }
        })
        
        setmyGroup(grouprry)
    });
    },[])

     // my Group List end ===========

    let handleGroupDelete = (item)=>{
        Swal.fire({
            title: 'Are you sure?',
            text: "Deleted this group",
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
                remove(ref(db, "Group/"+ item.key))     
                Swal.fire(
                'Deleted!',
                'Your post has been deleted.',
                'success'
                )
            }
            })  
           
    }
     
    let handleGroupRequest = (item)=>{    
        dispatch(groupr(item))
        localStorage.setItem("gr",JSON.stringify(item.key))
    }
    let back = ()=>{    
        setshow(false)
    }
    

    // group member show

    let handleGroupinfo = (gid)=>{
        const GroupRef = ref(db, 'groupmember');
        onValue(GroupRef, (snapshot) => {
        let groupmemberrry = [];
        snapshot.forEach((item)=>{
            if(data.uid == gid.AdminId && gid.key == item.val().groupid){
                groupmemberrry.push({...item.val(), key: item.key})
            }
        })
        
        setmyGroupMember(groupmemberrry)
        setshow(true)
    });
    }
    let handlememberdelete = (item)=>{    
        remove(ref(db, "groupmember/"+ item.key))
    }

    // group sms start
    let handlegroupsms = (item)=>{
        console.log(item)
        dispatch(singleSms({status:"group", id:item.key, name:item.GroupName, AdminId:item.AdminId,}))
        // localStorage.setItem("active", JSON.stringify({status:"groupSms", id:item.senderId, name:item.senderName}))
    }
    // group sms end
  return (
    <div className='shadow-lg w-full relative border mt-3 px-4 py-3 rounded-lg h-[459px] overflow-y-scroll'>
    
        <h3 className='text-xl font-semibold font-popin text-black'>My Groups</h3>
        <BsThreeDotsVertical className='absolute top-[15px] right-2'></BsThreeDotsVertical>
        <div className='mx-auto mt-2'>
            <button onClick={back} className='font-popin font-bold text-white text-sm bg-heading px-5 py-1 rounded-md mr-2'>Back</button>
        </div>
                        
        {show ?
                       
            myGroupMember.map((item) =>(
                <div className='flex gap-x-5 items-center border-b border-solid border-loginbtn pb-3.5'>
                    <div>
                        <img className='w-[70px] h-[70px] rounded-full mt-4' src='image/friend.png'></img>
                    </div>

                    <div className='text-left'>
                        <p className='font-popin font-bold text-sm text-heading'>Admin : {item.username}</p>                  
                    </div>
                    <div className='mx-auto mt-2'>
                        <button onClick={()=>handlememberdelete(item)} className='font-popin font-bold text-white text-sm bg-heading px-5 py-1 rounded-md mr-2'>Delete</button>
                    </div>
                </div>
            ))
         
        :
         
            myGroup.length == 0 ? <p className='font-popin font-bold text-xl text-heading flex justify-center mt-12'>Group Not Avilable</p>:
               
            myGroup.map((item) =>(
                <div onClick={()=>handlegroupsms(item)} className='flex gap-x-5 items-center   border-b border-solid border-loginbtn pb-3.5'>
                    <div>
                        <img className='w-[70px] h-[70px] rounded-full mt-4' src='image/friend.png'></img>
                    </div>

                    <div className='text-left'>
                        <h4 className='font-popin font-semibold text-sm text-black mt-2'>{item.GroupName}</h4>
                        <p className='font-popin font-medium text-xs text-[#4D4D4D]'>{item.GroupTag}</p>
                        <p className='font-popin font-bold text-xs text-heading'>Admin Name : {item.AdminName}</p>
                
                        <div className='flex'>
                            <div className='mx-auto mt-2'>
                                <button onClick={()=>handleGroupRequest(item)} className='font-popin font-bold text-white text-sm bg-heading px-5 py-1 rounded-md mr-2'><Link to="/grouprequest">Request</Link></button>
                            </div>
                            <div className='mx-auto mt-2'>
                                <button onClick={()=>handleGroupDelete(item)} className='font-popin font-bold text-white text-sm bg-rebbtn px-5 py-1 rounded-md'>Delete</button>
                            </div>
                        </div>
                        <div className='mx-auto mt-2'>
                            <button onClick={()=>handleGroupinfo(item)} className='font-popin font-bold text-white text-sm bg-heading px-5 py-1 rounded-md'>Your's Group Member</button>
                        </div>
                    </div>
                </div>
            ))
         }
        
    </div>
)
}

export default MyGroups