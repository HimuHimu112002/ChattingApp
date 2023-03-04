import React, { useState } from 'react'
import {Link, useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail} from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';

const Forget = () => {
    
    const auth = getAuth();
    let navigate = useNavigate();
    
    let [email, setEmail] = useState('')

    let handleforget = ()=>{
        sendPasswordResetEmail(auth, email).then(() => {
           setTimeout(()=>{
            navigate("/login")
           },2000)
        toast.success("Check your email for reset password")
    })

}

  return (
    
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-full h-screen flex justify-center items-center">
        <ToastContainer position="bottom-center" theme="dark"/>

        <div className='bg-white p-5 drop-shadow-lg rounded-md'>
            <h3 className='text-3xl text-buttorColor font-open font-bold text-loginHeading w-[300px] text-center p-4 lg:w-96'>Forgot Password</h3>
        
            <div className='relative mt-10'>
                <input onChange={(e)=>setEmail(e.target.value)} type="email" className="border border-inputBorder border-solid w-full py-4 px-14 rounded-lg lg:w-[368px]"></input>
                <p className='text-sm font-nonito font-semibold text-heading absolute left-[34px] top-[-10px] bg-white px-[18px]'>Email Address</p>                                     
            </div>
        
            <div className='flex justify-between'>
                <Link to="/login" className='font-open text-sm font-semibold text-[#EA6C00]'>
                    <button onClick={handleforget} className='bg-gradient-to-r from-purple-600 to-pink-600 font-nonito text-md font-bold rounded-md w-[150px] text-white py-5 mt-12 lg:w-[175px]'>Update Password</button>
                </Link>

                <Link to="/login" className='font-open text-sm font-semibold text-[#EA6C00]'>
                <button className='bg-gradient-to-r to-pink-600 from-purple-600 font-nonito text-md font-bold rounded-md w-[140px] text-white py-5 mt-12 lg:w-[175px]'>Back To Login</button></Link>
            </div>

        </div>

    </div>
    
  );
}

export default Forget