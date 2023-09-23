import React, { useEffect, useState } from 'react'
import {useSelector} from "react-redux"
import { getDatabase, ref, onValue, set, push} from "firebase/database";
import Sidebar from '../../components/Sidebar'
import MyGroups from '../../components/MyGroups'
import Friends from '../../components/Friends'
import { IoIosVideocam } from 'react-icons/io';
import { MdInsertPhoto } from 'react-icons/md';
import { BiSend } from 'react-icons/bi';
import { BsEmojiExpressionless } from 'react-icons/bs';
import ModalImage from "react-modal-image";
import { AiFillCamera } from 'react-icons/ai';
import { ImCross } from 'react-icons/im';
import { AudioRecorder } from 'react-audio-voice-recorder';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { getStorage, uploadBytes, ref as storageref, uploadBytesResumable, getDownloadURL, uploadString } from "firebase/storage";
import EmojiPicker from 'emoji-picker-react';
import GroupList from '../../components/GroupList'
import ScrollToBottom from 'react-scroll-to-bottom';


const Message = () => {
  const storage = getStorage();
  // for image

  let db = getDatabase()
  let activeName = useSelector((state)=>state.userLoginInfo.active)

  // let GroupactiveName = useSelector((state)=>state.userLoginInfo.group)
  let data = useSelector((state)=> state.userLoginInfo.userInfo);
  const [sms, setsms] = useState("")
  const [smserr, setsmserr] = useState("")
  const [check, setcheck] = useState(false)
  const [smssend, setsmssend] = useState([])
  const [Groupsmssend, setGroupsmssend] = useState([])
  const [Groupmember, setGroupmember] = useState([])
  const [audio, setaudio] = useState("")
  const [blob, setBlob] = useState("")
  const [emoji, setemoji] = useState(false)
  const [captureImage, setcaptureImage] = useState("")

  // camera image section start=====================
  function handleTakePhoto (dataUri) {
    setcaptureImage(dataUri);
    const storageRef = storageref(storage, "hi");
    // hi ata akti child name ata na dile firebase error dibe
    uploadString(storageRef, dataUri, 'data_url').then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        set(push(ref(db, "singlesms")),{
          whosendid: data.uid,
          whosendname: data.displayName,
          whorechiveid: activeName.id,
          whorechivename: activeName.name,
          image:downloadURL,
        })
      }).then(()=>{
        captureImage(false)
      })
    });
  }

  // camera image section end =====================


  // input sms section start=====================

  let handleSmsInput = (item)=>{
    setsms(item.target.value)
    setsmserr("")

  }

  let handleSmsSend = ()=>{
    if(!sms){
      setsmserr("Please write text somthing .")
    }else if(activeName.status == "single"){
      set(push(ref(db, "singlesms")),{
        whosendid: data.uid,
        whosendname: data.displayName,
        whorechiveid: activeName.id,
        whorechivename: activeName.name,
        msg:sms,
      }).then(()=>{
        setsms("")
        setemoji("")
      })
    }else{
      set(push(ref(db, "groupsms")),{
        whosendid: data.uid,
        whosendname: data.displayName,
        whorechiveid: activeName.id,
        whorechivename: activeName.name,
        adminid: activeName.AdminId,
        groupmsg:sms,
      }).then(()=>{
        setsms("")
        setemoji("")
      })
    }
  }

  // input sms section end =====================

  useEffect(()=>{
    onValue(ref(db, "singlesms"), (snapshot)=>{
      let smsarry = []
      snapshot.forEach((item)=>{
        if(item.val().whosendid == data.uid && item.val().whorechiveid == activeName.id || item.val().whorechiveid == data.uid && item.val().whosendid == activeName.id){

          smsarry.push(item.val())
        }
      })
      setsmssend(smsarry)
    })
  }, [activeName])
  // activeName.id akhane deoyar karon holo id change holei useEffect run korte thakbe

  useEffect(()=>{
    onValue(ref(db, "groupsms"), (snapshot)=>{
      let smsarry = []
      snapshot.forEach((item)=>{
        smsarry.push(item.val())
        
      })
      setGroupsmssend(smsarry)
    })
  }, [activeName])

  // group member show
  useEffect(()=>{
    onValue(ref(db, "groupmember"), (snapshot)=>{
      let arry = []
      snapshot.forEach((item)=>{
        arry.push(item.val().groupid+ item.val().userid)
        
      })
      setGroupmember(arry)
    })
  },[])


  // gallery image send start 
  let handleImageUpload = (e)=>{
    // console.log("himu")
    const storageRef = storageref(storage, e.target.files[0].name);

    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
      }, 
    (error) => {
      // console.log(error)
    },() => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      set(push(ref(db, "singlesms")),{
        whosendid: data.uid,
        whosendname: data.displayName,
        whorechiveid: activeName.id,
        whorechivename: activeName.name,
        image:downloadURL,
      })
    });
  }
);
}
  // gallet=ry image send end


  // voice record start
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    setaudio(url)
    setBlob(blob)
    
  };

  let handleaudiosend = ()=>{
    const audiostorageRef = storageref(storage, audio);
    // 'file' comes from the Blob or File API
    uploadBytes(audiostorageRef, blob).then((snapshot) => {
    getDownloadURL(audiostorageRef).then((downloadURL) => {
      //console.log('File available at', downloadURL);
      set(push(ref(db, "singlesms")),{
        whosendid: data.uid,
        whosendname: data.displayName,
        whorechiveid: activeName.id,
        whorechivename: activeName.name,
        audio:downloadURL,
      }).then(()=>{
        setaudio("")
      })
    });
  });
  }


  // emoji send
  let handleemojisend = (emoji)=>{
    setsms(sms + emoji.emoji)
  }


  // enter press
  let handleEnterPress= (e)=>{
    if(e.key == "Enter"){
      if(!sms){
        setsmserr("Please write text somthing .")
      }else if(activeName.status == "single"){
        set(push(ref(db, "singlesms")),{
          whosendid: data.uid,
          whosendname: data.displayName,
          whorechiveid: activeName.id,
          whorechivename: activeName.name,
          msg:sms,
        }).then(()=>{
          setsms("")
          setemoji("")
        })
      }else{
        set(push(ref(db, "groupsms")),{
          whosendid: data.uid,
          whosendname: data.displayName,
          whorechiveid: activeName.id,
          whorechivename: activeName.name,
          adminid: activeName.AdminId,
          groupmsg:sms,
        }).then(()=>{
          setsms("")
          setemoji("")
        })
      }
    }
  }
 
return (
    <div className='lg:flex justify-items-center'>
        <>
        <div className='w-[150px] ml-2'>
          <Sidebar active="usermsg"></Sidebar>
        </div>

        <div className='xl:grid xl:grid-cols-2 sm:grid-cols-1 md:grid-cols-2'>

        <div className='max:w-auto sm:w-auto h-2/4 mx-4 pl-2'>
          {/* <GroupList></GroupList> */}
          {/* <MyGroups></MyGroups> shadow-lg max:w-auto relative border mt-3 px-5 py-3 rounded-lg h-[431px] overflow-y-scroll */}
          <Friends></Friends>
        </div>

        <div className='shadow-lg rounded-lg max:w-auto mx-5 h-[615px] sm:w-auto shadow-md  mt-4 relative pl-2'>

          <div className='mb-4 flex gap-x-3 border-b border-solid border-[#ecebeb] px-3 py-3 '>
            <div className='relative'>
                <img className='w-[70px] h-[70px] rounded-full shadow-md' src={data.photoURL}></img>
                <div className='w-[13px] h-[13px] rounded-full bg-green-500 absolute top-12 right-[-1px]'></div>
            </div>
            <div className='mt-4'>
              <h2 className='font-popin font-semibold text-xl text-black'>{activeName &&activeName.name}</h2>
              <h2 className='font-popin font-normal text-sm text-[#4D4D4D]'>Online</h2>
            </div>
          </div>
                        
         

          <ScrollToBottom className='overflow-y-scroll h-[400px] border-b pb-2'>

            {activeName && activeName.status == "single" ?(
              smssend.map((item)=>(
                item.whosendid == data.uid 
                ? 
                ( item.msg 
                  ?
                  (<div className='mr-2 mt-4 text-right'>
                    <div className='bg-[#5F35F5] inline-block px-4 py-2 rounded-md'>
                      <p className='font-popin font-normal text-sm text-[#fff]'>{item.msg}</p>
                    </div>
                    <p className='font-popin font-normal text-[12px] text-[#c2c0c0] mt-1'>Today 8:02 pm</p>
                  </div>): item.image ? (<div className='mr-2 mt-4 text-right'>
                    <div className=' mr-2 mt-4 text-right w-50'>
                      <ModalImage
                      small={item.image}
                      large={item.image}
                      />
                    </div>
                      <p className='font-popin font-normal text-[12px] text-[#c2c0c0] mt-1'>Today 8:02 pm</p>
                  </div>) :(<div className='mr-2 mt-4 text-right'>
                              <div className='inline-block'>
                                <audio controls src={item.audio}></audio>
                              </div>
                              <p className='font-popin font-normal text-[12px] text-[#c2c0c0] mt-1'>Today 8:02 pm</p>
                            </div>)
                  
                ):item.msg 
                ?
                (<div className='mr-2 mb-4'>
                  <div className='bg-[#F1F1F1] inline-block px-4 py-2 rounded-md'>
                    <p className='font-popin font-normal text-sm text-[#4D4D4D]'>{item.msg}</p>
                  </div>
                  <p className='font-popin font-normal text-[12px] text-[#c2c0c0] mt-1'>Today 8:02 pm</p>
                </div>)
                : 
                (<div className='mr-2 mb-4'>
                  <div className='mr-2 mt-4 text-right w-2.5'>
                  <ModalImage
                    small={item.image}
                    large={item.image}
                    />
                  </div>
                  <p className='font-popin font-normal text-[12px] text-[#c2c0c0] mt-1'>Today 8:02 pm</p>
                </div>)   
            
              ))
            )
            : 
            data.uid == activeName && activeName.AdminId ||  Groupmember.includes(activeName.id+ data.uid ) ? 
        
            Groupsmssend.map((item)=>(

              item.whosendid == data.uid 
              ? 
              (
               item.whorechiveid == activeName && activeName.id &&
                <div className='mr-2 mt-4 text-right px-3 '>
                <div className='bg-[#5F35F5] inline-block px-4 py-2 rounded-md'>
                  <p className='font-popin font-normal text-sm text-[#fff]'>{item.groupmsg}</p>
                </div>
                <p className='font-popin font-normal text-[12px] text-[#c2c0c0] mt-1'>Today 8:02 pm</p>
              </div>)
               
               :
               (
                item.whorechiveid == activeName && activeName.id &&
                <div className='mr-2 mb-4 px-3'>
                  <div className='bg-[#F1F1F1] inline-block px-4 py-2 rounded-md'>
                    <p className='font-popin font-normal text-sm text-[#4D4D4D]'>{item.groupmsg}</p>
                  </div>
                  <p className='font-popin font-normal text-[12px] text-[#c2c0c0] mt-1'>Today 8:02 pm</p>
                </div>)
            ))
            :
             <h1>Not a member</h1>
            }           

          </ScrollToBottom>

          <div>
          {activeName.status === "single"&&
          <div className='w-full text-center py-6 flex justify-around'>
              
              <div className='relative ml-3 px-2'>
              {/* audio section */}
              {audio && 
                <div className=' absolute top-[-130px] left-[0px] z-50 bg-red-400 px-2 py-2 rounded-md'>

                  {audio && <audio controls src={audio}></audio>} 
                  <button onClick={handleaudiosend} className='bg-heading text-white px-2.5 py-1 rounded-md hover:bg-green-600 duration-300 text-sm mr-1'>send</button>
                  <button onClick={()=>setaudio("")} className='bg-heading text-white px-2.5 py-1 rounded-md hover:bg-green-600 duration-300 text-sm'>Delete</button>
                </div>
              }
              {/* audio section */}


              {/* input section */}
                
                <input onKeyUp={handleEnterPress} onChange={handleSmsInput} value={sms} className='relative sm:w-auto lg:w-[300px] px-4 py-2 bg-[#f1f1f1] text-black border-none outline-none rounded-full ml-5'></input>
                
                <AiFillCamera onClick={()=>setcheck(!check)} className='absolute top-2.5 right-16 text-black cursor-pointer'></AiFillCamera> 
                
                <BsEmojiExpressionless onClick={()=>setemoji(!emoji)} className='absolute top-2.5 right-10 text-black cursor-pointer'></BsEmojiExpressionless>
                {emoji && <div className="absolute bottom-12 left-4"><EmojiPicker onEmojiClick={(emoji)=>handleemojisend(emoji)}/></div>}

                
                <div>
                <label>
                  <MdInsertPhoto className='absolute top-2.5 right-4 text-black cursor-pointer'></MdInsertPhoto>
                  <input onChange={handleImageUpload} className='hidden' type="file"></input>

                </label>

                </div>
                <button onClick={handleSmsSend} className='mt-2 bg-heading text-white px-6 py-1 rounded-md hover:bg-green-600 duration-500 text-xl'><BiSend></BiSend></button>

              </div>
                <p className='ml-10 absolute top-10 text-red-500 font-dm font-semibold px-6 py-1 rounded-md'>{smserr}</p>
                {/* input section  end*/}

                {/* audio section */}
                <label>
                  <AudioRecorder onRecordingComplete={(blob) => addAudioElement(blob)} />
                </label>
                {/* audio section */}

                {/* <IoIosVideocam className='absolute bottom-9 left-2 text-black cursor-pointer'></IoIosVideocam> */}
              
              
            </div> 
            
            }
          </div>
        </div>
        </div>

        {check && 
          <div className='w-full h-screen absolute top-0 left-0 flex justify-center items-center z-50'>
          <ImCross className='top-0 right-0 cursor-pointer' onClick={()=> setcheck(false)}></ImCross>
            <Camera
              onTakePhoto = {(dataUri) => { handleTakePhoto(dataUri);}}
              idealFacingMode = {FACING_MODES.ENVIRONMENT}
              idealResolution = {{width: 1200, height: 480}}
              imageType = {IMAGE_TYPES.JPG}
              imageCompression = {0.97}
              isMaxResolution = {true}
              isImageMirror = {true}
              isSilentMode = {false}
              isDisplayStartCameraError = {true}
              isFullscreen = {false}
              sizeFactor = {1}
              />
              </div>
          }
        </>        
    </div>
  )
}

export default Message


// {activeName.status == "single"?: data.uid == activeName && activeName.AdminId ||  Groupmember.includes(activeName.id+ data.uid )  &&