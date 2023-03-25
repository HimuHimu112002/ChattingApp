import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom";
import {useSelector} from "react-redux"
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";

function GroupCreate() {
    const db = getDatabase();
    
    let [GroupRequest, setGroupRequest] = useState([])

    let id = useSelector((state)=> state.userLoginInfo.gr.key);
    let data = useSelector((state)=> state.userLoginInfo.userInfo);

    useEffect(()=>{
        const GroupRef = ref(db, 'GroupJoinRequest/');
        onValue(GroupRef, (snapshot) => {
        let groupReqArry = [];
        snapshot.forEach((item)=>{
            //data.uid je login ase tar admin id and item.val().AdminId je req pathaise tar admin id
            if(data.uid == item.val().AdminId && item.val().GroupId == id){
                groupReqArry.push({...item.val(), key: item.key})

            }
        })
        setGroupRequest(groupReqArry)
    });
    },[])

    let handleMemberRequest = (item)=>{
        console.log(item)
        set(push(ref(db, "groupmember")),{
            adminin: item.AdminId,
            adminname: item.AdminName,
            groupid: item.GroupId,
            groupname: item.GroupName,
            userid: item.UserId,
            username: item.UserName

        }).then(()=>{
            remove(ref(db, "GroupJoinRequest/"+item.key))
        })
    }

    let handleMemberdelete = (item)=>{
        remove(ref(db, "GroupJoinRequest/"+item.key))
    }
    
  return (
    <>
        <div className='px-2.5 w-2/4 m-auto'>
    
            <div className='px-4 py-4 shadow-2xl mt-12 rounded-md'>
                <div className='md:mt-14 mt-12 justify-center grid mb-8'>
                    <h3 className='text-3xl font-open font-bold text-loginHeading text-center'>Group Request List</h3>

                        {GroupRequest.map(item=>(

                        <div className='flex gap-x-5 items-center border-b border-solid border-loginbtn pb-2'>
                        <div>
                            <img className='w-[70px] h-[70px] rounded-full mt-4' src='image/friend.png'/>
                        </div>

                        <div className='text-left'>
                            <h4 className='font-popin font-semibold text-sm text-black'>{}</h4>
                            <p className='font-popin font-medium text-xs text-[#4D4D4D]'>{}</p>
                            <p className='font-popin font-bold text-xs text-heading'>Admin Name : {item.AdminName}</p>
                            <p className='font-popin font-bold text-xs text-heading'> Name : {item.UserName}</p>

                            <div className='flex mt-2'>
                                <div className='mx-auto'>
                                <Link to="/"><button onClick={()=>handleMemberRequest(item)} className='font-popin font-bold text-white text-sm bg-heading px-5 py-1 rounded-md mr-2 '>Accept</button></Link>
                                </div>
                                <div className='mx-auto'>
                                    <button onClick={()=>handleMemberdelete(item)}  className='font-popin font-bold text-white text-sm bg-rebbtn px-5 py-1 rounded-md'>Delete</button>
                                </div>
                            </div>
                        </div>
                        </div>
                        ))}
                    <Link to="/"><p className='text-md font-nonito font-bold text-white text-center mt-2 bg-heading py-2'>Back to home ?</p></Link>     
                </div>
            </div>
        </div>
    </>
  )
}

export default GroupCreate