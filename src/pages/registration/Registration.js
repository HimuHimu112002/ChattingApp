import React, { useState } from 'react'
import {IoIosEyeOff, IoIosEye} from 'react-icons/io'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile  } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import { getDatabase, ref, set } from "firebase/database";
import { LineWave } from  'react-loader-spinner'
import {Link, useNavigate } from "react-router-dom";
// useNavigate use korar karon registration hole auto redirect kore login page chole jabe

function Registration() {

    const auth = getAuth();
    let navigatte = useNavigate();
    const db = getDatabase();

    let [email, Setemail] = useState("");
    let [fullname, Setfullname] = useState("");
    let [password, Setpassword] = useState("");
    // sms success show koranor custom code but akhon ay sms tost diye show korano
    // hobe so akhon ay code lagbena.
    //let [success, Setsuccess] = useState("");

    let [emailerr, Setemailerr] = useState("");
    let [fullnameerr, Setfullnameerr] = useState("");
    let [passworderr, Setpassworderr] = useState("");

    let [passwordshow, Setpasswordshow] = useState(false);
    let [loading, Setloading] = useState(false);

    // Input value access=============
    let handlemail = (item)=>{
        Setemail(item.target.value);
        Setemailerr("");
    }

    let handlename = (item)=>{
        Setfullname(item.target.value);
        Setfullnameerr("");
    }

    let handlepass = (item)=>{
        Setpassword(item.target.value);
        Setpassworderr("");
    }
    // Show the error sms after submit =============
    let handlesubmit = ()=>{
        // ! karon value jodi na thake tahole sms show korbe
        if(!email){
            Setemailerr("You have must be given the email address.");
        }else{
            if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
                Setemailerr("Invalid Email")
            }
        }

        if(!fullname){
            Setfullnameerr("You have must be given the name.");
        }

        if(!password){
            Setpassworderr("you have must be given the password.");
        }else{
            // if(!/^(?=.*[A-Z])/.test(password)){
            //     Setpassworderr("Uppercase Required");
            // }else if(!/^(?=.*[a-z])/.test(password)){
            //     Setpassworderr("Lowercase Required");
            // }else if(!/^(?=.*[0-9])/.test(password)){
            //     Setpassworderr("Number Required");
            // }else if(!/^(?=.*[!@#$%^&*])/.test(password)){
            //     Setpassworderr("Symbol Required");
            // }
            if(!/^(?=.{8,})/.test(password)){
                Setpassworderr("Password must be eight characters or longer");
            }

        }
        // jodi all value matching kore tahole submit hobe
        if(email && fullname && password && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) && /^(?=.{8,})/.test(password)){
            // for loading handle
            Setloading(true)

            createUserWithEmailAndPassword(auth, email, password).then((user) => {
                //Setsuccess(""); jodi tost use na kori tahole Setsuccess use kore sms show korano jai.

                // new acount korar pore default vabe profile image set korar jonno
                updateProfile(auth.currentUser,{    
                    displayName: fullname,
                    photoURL: "image/profile.jpg"
                    // akhane image giye upload profile default image set hobe
                  }).then(() => {
                    // tost sms show
                    toast.success("Registration Successfull. Please Varify Your Email Thank you.");
                    // Submit korar pore input value khali korar jonno
                    Setemail("");
                    Setfullname("");
                    Setpassword("");
                    // Email varify code
                    sendEmailVerification(auth.currentUser)
                    Setloading(false)
                    // after 2sec redirect login page jabe
                    setTimeout(()=>{
                        navigatte("/login")
                    },2000)

                  }).then(()=>{
                    set(ref(db, 'user/' + user.user.uid), {   
                        username: user.user.displayName,
                        email: user.user.email,
                        // profile_picture : imageUrl
                      });
                })                              

            })
            .catch((error)=>{
                Setemailerr(error.code)
                if(error.code.includes("auth/email-already-in-use")){
                    Setemailerr("This email is already in used.")
                    Setloading(false)
                }
            })
        }
    }

  return (
    <div className='px-2.5 lg:flex'>

    <ToastContainer position="bottom-center" theme="dark"/>

        <div className='md:justify-center lg:w-2/4 lg:flex lg:justify-end'>

            <div className='md:mt-28 lg:mr-16 lg:mt-8'>
                <h3 className='text-center mt-2 text-3xl font-nonito font-bold text-heading lg:text-left lg:text-2xl lg:mt-0'>Get started with easily register</h3>
                <p className='text-center mt-3.5 font-nonito font-normal text-subheading md:mr-16 md:text-2xl lg:text-left lg:text-sm'>Free register and you can enjoy it</p>

                {/* <p className='w-[350px] text-2xl font-nonito font-bold text-green-600'>{success}</p> */}

                <div className='relative mt-10'>
                    {/* value={email} ==> use korar karon submit korar pore input value khali kore dibe */}

                    <input onChange={handlemail} type="email" className="border border-inputBorder border-solid w-full py-4 px-14 rounded-lg lg:w-[368px]" value={email}></input>
                    <p className='text-sm font-nonito font-semibold text-heading absolute left-[34px] top-[-10px] bg-white px-[18px]'>Email Address</p>

                    {/* && deoyar karon error sms show korbe jodi error thake  ==========*/}
                    {emailerr &&
                        <p className='text-sm font-nonito font-semibold text-red-600 mt-2'>{emailerr}
                        </p>
                    }                   
                </div>

                <div className='relative mt-12'>
                    <input onChange={handlename} type="text" className="border border-inputBorder border-solid w-full py-4 px-14 rounded-lg lg:w-[368px]" value={fullname}></input>
                    <p className='text-sm font-nonito font-semibold text-heading absolute left-[34px] top-[-10px] bg-white px-[18px]'>Full Name</p>

                    {/* && deoyar karon error sms show korbe jodi error thake  ==========*/}
                    {fullnameerr &&
                        <p className='text-sm font-nonito font-semibold text-red-600 mt-2'>{fullnameerr}
                        </p>
                    }                   
                </div>

                <div className='relative mt-12'>
                    <input onChange={handlepass} type={passwordshow ? "text" :"password"} className="border border-inputBorder border-solid w-full py-4 px-14 rounded-lg lg:w-[368px]" value={password}></input>
                    <p className='text-sm font-nonito font-semibold text-heading absolute left-[34px] top-[-10px] bg-white px-[18px]'>Password</p>

                    {/* true = false 
                    false = true */}

                    {/* First click korle state false set kora ase passwordshow er biporit click er vitore true set hobe
                    then abar click korle state jabe and first click korai true set hoiyese biporit true set silo akhon false 
                    then click korle click er vitore ase false show set hobe */}
                    {passwordshow ?(
                        
                        <IoIosEye onClick={()=>Setpasswordshow(!passwordshow)} className='cursor-pointer absolute top-5 right-2'></IoIosEye>
                    ):(
                        <IoIosEyeOff onClick={()=>Setpasswordshow(!passwordshow)} className='cursor-pointer absolute top-5 right-2'></IoIosEyeOff>
                    )}
                                        

                    {/* && deoyar karon error sms show korbe jodi error thake  ==========*/}
                    {passworderr &&
                        <p className='text-sm font-nonito font-semibold text-red-600 mt-2'>    {passworderr}
                        </p>
                    }                   
                </div>

                    {/* after submit loading animation start*/}
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
                        middleCircleColor=""
                        />
                        </div>)
                        :
                        (<button onClick={handlesubmit} className='font-nonito text-sm font-semibold rounded-full w-full bg-buttorColor text-white py-5 mt-12 lg:w-[368px]'>Sign Up</button>)
                    }
                {/* after submit loading animation end*/}
                
                
                {/* link for redirect page  */}
                <p className='font-open text-sm font-semibold font-regular mb-2
                text-center mt-8 md:mb-0 lg:w-[368px]'>Already  have an account ? <Link to="/login" className='font-open text-sm font-semibold text-[#EA6C00]'>Sign In</Link></p>
            </div>

        </div>
        
        <div className='w-2/4 hidden lg:block'>
            <img className='w-full h-screen object-cover' src='image/registration.png'></img>
        </div>
        
    </div>
  )
}

export default Registration
