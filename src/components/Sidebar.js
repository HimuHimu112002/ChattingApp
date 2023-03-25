import React, {useState } from 'react'
import { AiOutlineHome, AiOutlineSetting, AiOutlineMessage } from 'react-icons/ai';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { MdCloudUpload } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import { CiLogin } from 'react-icons/ci';
import { getAuth, signOut,updateProfile } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { LineWave } from  'react-loader-spinner'
import { useDispatch, useSelector } from 'react-redux';
import { userLoginInfo } from '../slices/UserSlices';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getStorage, ref as sto, uploadString, getDownloadURL } from "firebase/storage";

const Sidebar = ({active}) => {
  const auth = getAuth();
  const storage = getStorage();
  let navigatee = useNavigate();
  let dispatch = useDispatch();

  let data = useSelector((state)=> state.userLoginInfo.userInfo);
  // database theke profile pic access korar system
  let activeName = useSelector((state)=>state.userLoginInfo.countnoti)

  let [loadding, Setloading] = useState(false)
  let [cancelLoad, SetcancelLoad] = useState(false)

  // profile image handle
  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [imageUploadShow, setimageUploadShow] = useState(false);

  
  // logout handle
  let handleLogout = () =>{
    signOut(auth).then(() => {
      dispatch(userLoginInfo(null))
      localStorage.removeItem("userInfo")
      navigatee("/login");
    })
  }

  // profile image handle
  const profileImageUpload = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
      // jodi kono data transfer hoi tahole files er majhe store korbe
    } else if (e.target) {
      files = e.target.files;
      // target use korar karon akek browser akek rokom kaj kore so all
      // browser jeno thik vabe kaj kore se jonne target use korte hoi
    }
    const reader = new FileReader();
    // jei image upload hobe setake read korar jonno js er default functin FileReader
    reader.onload = () => {
      setImage(reader.result);
      // image upload houyar pore reader.result total image access korbe and mechine code
      // convert kore nibe
    };
    reader.readAsDataURL(files[0]);
    // image file ke url 
  };

  // crop kora image handle
  const getCropData = () => {
    Setloading(true)
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      // getCroppedCanvas mane jetuku ongso crop kora hoiyese
      // toDataURL mane jetuku ongso crop kora hoiyese tar url create korar jonno
      //auth.currentUser.uid
      const storageRef = sto(storage, auth.currentUser.uid);
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, 'data_url').then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          // crop kora image download hoiye jei url asbe seita getDownloadURL er 
          // maddhome access kora hoi
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
            // akhane image giye upload profile default image set hobe
          }).then(()=>{
            Setloading(false)
            setTimeout(()=>{
              toast.success("Profile Picture Upload Successfull Please Wait.")
            },1000)
            setTimeout(()=>{
              setimageUploadShow(false) 
            },3000)
            setImage("")
          })
        });

    });
    
    }
    
  };


  let handleCancel = ()=>{
    SetcancelLoad(true)
    setTimeout(()=>{
      setimageUploadShow(false) 
    },1000)
    setImage("")
  }

  let handleProfile = ()=>{
    setimageUploadShow(true)
    SetcancelLoad(false)
    Setloading(false)
  }

  let [dartt, setdartt] = useState(false)

  return (
    <div className='w-full bg-heading rounded-3xl h-[954px]'>
    <ToastContainer position="top-right" theme="dark"/>
      <div className='p-9'>
        <div className='w-[90px] h-[90px] rounded-full relative group'>
          <img  className='w-full h-full mx-auto rounded-full' src={data.photoURL}></img>
          <div onClick={handleProfile} className='opacity-0 group-hover:opacity-60 cursor-pointer w-full h-full rounded-full bg-black absolute top-0 left-0] flex justify-center items-center'>
            <MdCloudUpload className='text-white text-3xl'></MdCloudUpload>
          </div>
        </div>
        {dartt ? 
        
        <h1 onClick={()=>setdartt(!dartt)} className='text-2xl font-semibold font-nonito text-white text-center mt-2 dark:text-red-500 cursor-pointer'>{data.displayName}</h1>
        : 
        <h1 onClick={()=>setdartt(!dartt)} className='text-2xl font-semibold font-nonito text-white text-center mt-2 cursor-pointer'>{data.displayName}</h1>
        }
        
        <Link to="/">
          <div className={`cursor-pointer mt-14 relative z-[1] after:z-[-1] ${active == "home" && "after:bg-white"}  after:w-[114px] after:h-[75px] after:content-[""] after:absolute after:top-[-14px] after:left-0 after:rounded-tl-md after:rounded-bl-md`}>
          <AiOutlineHome className={`text-5xl ${active == "home" ? "text-black" : "text-white"} mx-auto`}></AiOutlineHome>
          </div>
        </Link>

        <Link to="/message">
          <div className={`cursor-pointer mt-14 relative z-[1] after:z-[-1] ${active == "usermsg" && "after:bg-white"}  after:w-[114px] after:h-[75px] after:content-[""] after:absolute after:top-[-14px] after:left-0 after:rounded-tl-md after:rounded-bl-md`}>
          <AiOutlineMessage className={`text-5xl ${active == "usermsg" ? "text-black" : "text-white"} mx-auto`}></AiOutlineMessage>
          </div>
        </Link>

        <Link to="/notifications">
          <div className={`cursor-pointer mt-14 relative z-[1] after:z-[-1] ${active == "notifications" && "after:bg-white"}  after:w-[114px] after:h-[75px] after:content-[""] after:absolute after:top-[-14px] after:left-0 after:rounded-tl-md after:rounded-bl-md`}>
          <IoMdNotificationsOutline className={`text-5xl ${active == "notifications" ? "text-black" : "text-white"} mx-auto`}></IoMdNotificationsOutline>
          <div className='w-6 h-6 bg-red-700 absolute top-0 right-4 rounded-full'>
            <p className='flex justify-center items-center text-white'>{activeName}</p>
          </div>
          </div>
        </Link>


        <Link to="/setting">
        <div className={`cursor-pointer mt-14 relative z-[1] after:z-[-1] ${active == "setting" && "after:bg-white"}  after:w-[114px] after:h-[75px] after:content-[""] after:absolute after:top-[-14px] after:left-0 after:rounded-tl-md after:rounded-bl-md`}>
          <AiOutlineSetting className={`text-5xl ${active == "setting" ? "text-black" : "text-white"} mx-auto`}></AiOutlineSetting>
        </div>
        </Link>

        <div onClick={handleLogout} className='cursor-pointer text-center mt-48 relative z-[1] after:z-[-1] after:bg-none after:w-[107px] after:h-[75px] after:content-[""] after:absolute after:top-[-14px] after:left-0 after:rounded-tl-md after:rounded-bl-md before:w-[8px] before:h-[99px] before:content-[""] before:bg-none before:absolute before:top-[-14px] before:right-[-36px] before:rounded-tl-md before:rounded-bl-md'>
          <CiLogin className='text-5xl text-[#FFFFFF] mx-auto'></CiLogin>
        </div>

      </div>

      {/* profile upload section */}
      
      {imageUploadShow && 
      <div className='z-50 w-full h-screen bg-heading absolute top-0 left-0 flex justify-center items-center'>
          <div className='w-2/4 bg-white rounded-lg p-4'>
              <h1 className='text-3xl font-semibold font-nonito text-black text-center mt-4'>Upload Your Profile Picture</h1>
              {/* preview image and crop image handle */}
              {image?
              <div className='w-[90px] h-[90px] rounded-full overflow-hidden mx-auto'>
                <div className="img-preview w-full h-full mx-auto rounded-full"/>
              </div>
              :(<img  className='w-28 h-28 mx-auto rounded-full' src={data.photoURL}></img>)}
               {/* profile picture asche registration page theke */}

              <div className='w-full flex justify-center'>
                <input onChange={profileImageUpload} className='mt-8 ml-28 mb-2' type="file"></input> <br></br>
              </div>

              {image && (

              <Cropper
                style={{ height: 280, width: "100%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                onInitialized={(instance) => {
                setCropper(instance);
              }}
                guides={true}/>
              )}

              <div className='w-full flex justify-center'>
              {loadding?
                (<div className='flex justify-center justify-center'>
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
                </div>
                ):(<button onClick={getCropData} className='font-nonito text-sm font-semibold rounded-md bg-loginbtn text-white mt-8 p-5 '>Upload</button>)
              }
              
              {cancelLoad?
                (<div className='flex justify-center'>
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
                </div>
                ):(<button onClick={handleCancel} className='ml-4 font-nonito text-sm font-semibold rounded-md bg-red-500 text-white mt-8 p-5'>Cancel</button>)
              }
            </div>
              
          </div>
      </div>
    }
    </div>
  )
}

export default Sidebar