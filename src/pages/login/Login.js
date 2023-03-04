import React, { useState } from 'react'
import {IoIosEyeOff, IoIosEye} from 'react-icons/io'
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import { LineWave } from  'react-loader-spinner'
import {Link, useNavigate } from "react-router-dom";
// data redux er kase pathanor jonno
import { useDispatch } from 'react-redux';
import { userLoginInfo } from '../../slices/UserSlices';

const Login = () => {

    const auth = getAuth();
    let navigatte = useNavigate();
    const provider = new GoogleAuthProvider();
    // data redux er kase pathanor jonno
    const dispatch = useDispatch();

    let [email, Setemail] = useState("");
    let [password, Setpassword] = useState("");

    let [emailerr, Setemailerr] = useState("");
    let [passworderr, Setpassworderr] = useState("");

    let [passwordshow, Setpasswordshow] = useState(false);
    let [loading, Setloading] = useState(false);

    let handlemail = (item)=>{
        Setemail(item.target.value);
        Setemailerr("");
    }

    let handlepass = (item)=>{
        Setpassword(item.target.value);
        Setpassworderr("");
    }

    let handlesubmit = ()=>{
        if(!email){
            Setemailerr("You have must be given the email address.");
        }else{
            if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
                Setemailerr("Invalid Email")
            }
        }

        if(!password){
            Setpassworderr("you have must be given the password.");
        }else{
            
            if(!/^(?=.{8,})/.test(password)){
                Setpassworderr("Password must be eight characters or longer");
            }
        }

        if(email && password && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) && /^(?=.{8,})/.test(password)){
            Setloading(true)
            signInWithEmailAndPassword(auth, email, password)
            // user login korar pore all information guli then er vitore parameters 
            // er vitore store hobe
            .then((user) => {
                Setloading(false)
                toast.success("Login Successfull Please Wait.")
                // user theke jei data asbe userLoginInfo er maddhome redux er action er kase
                // pathalam
                dispatch(userLoginInfo(user.user))
                // local store data save rakhar jonno
                localStorage.setItem("userInfo",JSON.stringify(user))
                
                setTimeout(()=>{
                    navigatte("/")
                },2000)
            })
            .catch((error) => {
                const errorCode = error.code;
                Setemailerr(error.code)
                if(errorCode.includes("auth/user-not-found")){
                    Setpassworderr("Email Not Found")
                }
                if(errorCode.includes("auth/network-request-failed")){
                    Setemailerr("Network Connection Not Found")
                }
                if(errorCode.includes("auth/wrong-password")){
                    Setpassworderr("Password not matching")
                }
                if(errorCode.includes("auth/wrong-password")){
                    Setpassworderr("Password incorrect")
                }
                Setloading(false)
            });

        }
    }

let handleGoolge = ()=>{
    signInWithPopup(auth, provider).then(()=>{
        setTimeout(()=>{
            navigatte("/")
        },3000)
    })
}

  return (
    <div className='px-2.5 lg:flex'>

    <ToastContainer position="bottom-center" theme="dark"/>

        <div className='md:justify-center lg:w-2/4 lg:flex lg:justify-end'>
            <div className='md:mt-14 lg:mr-16 mt-12'>
                <h3 className='text-3xl font-open font-bold text-loginHeading'>Login to your account!</h3>

                <div onClick={handleGoolge} className='cursor-pointer w-[155px] flex justify-around mt-[53px] border rounded-md py-2'>
                    <div><img className='w-5' src='image/gggg.jpg'></img></div>
                    <div className='inline font-semibold text-loginHeading text-xs font-open'><p>Login with Google</p></div>
                </div>
                
                <div className='relative mt-16'>

                    <input onChange={handlemail} type="email" className="border-b border-inputBorder border-solid w-full py-4 outline-0 lg:w-[368px]" value={email}></input>
                    <p className='text-sm font-nonito font-semibold text-loginHeading absolute top-[-10px] bg-white'>Email Address</p>
              
                    {emailerr &&
                        <p className='text-sm font-nonito font-semibold text-red-600 mt-2'>{emailerr}
                        </p>
                    }                   
                </div>

                <div className='relative mt-12'>
                    <input onChange={handlepass} type={passwordshow ? "text" :"password"} className="border-b border-inputBorder border-solid w-full py-4 outline-0 lg:w-[368px]" value={password}></input>
                    <p className='text-sm font-nonito font-semibold text-loginHeading absolute top-[-10px] bg-white'>Password</p>

                    {passwordshow ?(
                        <IoIosEye onClick={()=>Setpasswordshow(!passwordshow)} className='cursor-pointer absolute top-5 right-2'></IoIosEye>
                    ):(
                        <IoIosEyeOff onClick={()=>Setpasswordshow(!passwordshow)} className='cursor-pointer absolute top-5 right-2'></IoIosEyeOff>
                    )}
                                        
                    {passworderr &&
                        <p className='text-sm font-nonito font-semibold text-red-600 mt-2'> {passworderr}
                        </p>
                    }                   
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
                        (<button onClick={handlesubmit} className='font-nonito text-sm font-semibold rounded-md w-full bg-loginbtn text-white py-5 mt-12 lg:w-[368px]'>Login to your Continue</button>)
                    }
                              
                <p className='font-open text-sm font-semibold font-regular text-center
                mt-8 lg:w-[368px]'>Don’t have an account ? <Link to="/registration" className='font-open text-sm font-semibold text-[#EA6C00]'>Sign Up</Link></p>

                <p className='font-open text-sm font-semibold font-regular text-center mb-2
                mt-2 lg:w-[368px]'><Link to="/forgetPassword" className='font-open text-sm font-semibold text-[#EA6C00]'>Forget Password</Link></p>
            </div>

        </div>
        
        <div className='w-2/4 hidden lg:block'>
            <img className='w-full h-screen object-cover' src='image/log.png'></img>
        </div>

    </div>
  )
}

export default Login