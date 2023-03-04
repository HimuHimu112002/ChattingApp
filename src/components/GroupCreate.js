import React, {useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { LineWave } from  'react-loader-spinner'
import {Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, set, push } from "firebase/database";
import { useSelector } from 'react-redux';
function GroupCreate() {
    const db = getDatabase();
    let data = useSelector((state)=> state.userLoginInfo.userInfo);

    let [loading, Setloading] = useState(false);
    let [GroupName, SetGroupName] = useState("");
    let [GroupTag, SetGroupTag] = useState("");
    let [GroupNameerr, SetGroupNameerr] = useState("");
    let [GroupTagerr, SetGroupTagerr] = useState("");
    let navigate = useNavigate();

    let handleGroupName = (item)=>{
        SetGroupName(item.target.value);
        SetGroupNameerr("")
    }
    let handleGroupTagLine = (item)=>{
        SetGroupTag(item.target.value);
        SetGroupTagerr("")
    }
    
    let handlesubmit = ()=>{
        if (!GroupName) {
            SetGroupNameerr("Please Insert Your Group Name")
        }
        if (!GroupTag) {
            SetGroupTagerr("Please Insert Your Group Tag Line")
        }
        if (GroupName && GroupTag) {
            set(push(ref(db, 'Group')), {
                GroupName: GroupName,
                GroupTag: GroupTag,
                AdminId: data.uid,
                AdminName: data.displayName,
                })
                Setloading(true)
                toast.success("Group Create Successfull.")
                setTimeout(()=>{
                    Setloading(false)
                },2000)

                setTimeout(()=>{
                    navigate("/")
                },3000)
        }
        
        

    }
  return (
    <>
        <div className='px-2.5 w-2/4 m-auto '>
            <ToastContainer position="top-right" theme="dark"/>

        <div className='px-4 py-4 shadow-2xl mt-12 rounded-md'>
            <div className='md:mt-14 mt-12 justify-center grid mb-8'>
                <h3 className='text-3xl font-open font-bold text-loginHeading text-center'>Create A Group</h3>

                <div className='relative mt-12'>
                    <input onChange={handleGroupName} type="text" placeholder='Group Name' className="flex border-b border-subheading border-solid w-full py-4 outline-0 lg:w-[368px]"></input>
                    <p className='font-open font-semibold text-rebbtn text-sm'>{GroupNameerr}</p>
                </div>

                <div className='relative mt-8'>
                    <input onChange={handleGroupTagLine} type="text" placeholder='Group TagLine' className="border-b border-subheading border-solid w-full py-4 outline-0 lg:w-[368px]"></input>
                    <p className='font-open font-semibold text-rebbtn text-sm'>{GroupTagerr}</p>
                </div>

                {loading?
                    (
                    <div className='flex justify-center'>
                    <LineWave
                    height="100"
                    width="100"
                    color="#4fa94d"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="three-circles-rotating"
                    outerCircleColor=""
                    innerCircleColor=""
                    middleCircleColor=""/>
                    </div>)
                    :
                    (<button onClick={handlesubmit} className='font-nonito text-xl font-semibold rounded-md w-full bg-heading text-white py-4 mt-8 lg:w-[368px]'>Create</button>)
                }
                <p className='text-md font-nonito font-bold text-heading text-center mt-2'><Link to="/">Back to home ?</Link> </p>
                <p className='text-md font-nonito font-bold text-heading text-center mt-1'>Create groups to enjoy and chat with friends.</p>
                        
        </div>
    </div>
</div>
    </>
  )
}

export default GroupCreate