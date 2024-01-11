import React, { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { getDatabase, ref, onValue, remove, set, push } from "firebase/database";
import { useSelector } from 'react-redux';

const BlockAccount = () => {
    const db = getDatabase();
    let data = useSelector((state)=> state.userLoginInfo.userInfo);
    const [block, setblock] = useState([])

    // Friends block section ui te show START CODE ===============
    useEffect(()=>{
        const starCountRef = ref(db, 'block/');
        onValue(starCountRef, (snapshot) => {
            let blockArray = []
            snapshot.forEach((item)=>{
                if(item.val().blockbyId == data.uid){
                    blockArray.push({
                        id: item.key,
                        block: item.val().block,
                        blockId: item.val().blockId
                    })
                }else{
                    blockArray.push({
                        id: item.key,
                        blockbyId: item.val().blockbyId,
                        blockby: item.val().blockby
                        
                    })
                }
            })
            setblock(blockArray)
        });
    }, [])

    // Friends block section ui te show END CODE ===============


    // handle unblock section CODE START =================
    let handleUnblock = ((item)=>{
        set(push(ref(db, 'FriendAccept/')), {
            senderName: item.block,
            senderId: item.blockId,
            rechiverName: data.displayName,
            rechiverId: data.uid,
            // akhane jei kaj hosche seta holo je login ase se friend rechiv korse so 
            // data.displayName and data.uid rechiver name
            })
            .then(()=>{
              remove(ref(db, 'block/' + item.id))
            });

    })
    // handle unblock section END START =================


  return (

    block == "" ?
    (<div className='shadow-lg w-full relative border mt-3 px-5 py-3 rounded-lg h-[459px] overflow-y-scroll'>
        <h3 className='text-xl font-semibold font-popin text-black'>Block Account</h3>
        <BsThreeDotsVertical className='absolute top-[15px] right-2'></BsThreeDotsVertical>
      
        <h3 className='text-sm bg-loginbtn font-semibold font-popin text-white py-3 px-2 text-center rounded mt-5'>You don't have any blocked friends</h3>
    </div>)
     :
     (<div className='shadow-lg w-full relative border mt-3 px-5 py-3 rounded-lg h-[459px] overflow-y-scroll'>
        <h3 className='text-xl font-semibold font-popin text-black'>Block Account</h3>
        <BsThreeDotsVertical className='absolute top-[15px] right-2'></BsThreeDotsVertical>
      
        {block.map(item=>(
            <div className='flex gap-x-5 items-center border-b border-solid border-loginbtn pb-3.5'>
            {/* <div>
                <img className='hidden lg:block md:w-[70px] md:h-[70px] rounded-full mt-4' src={data.photoURL}/>
            </div> */}
            {/* <div className='hidden md:block rounded-full mt-2 px-5 py-5 rounded-full border border-1 border-green-700'>
                <h4 className='rounded-full font-popin font-semibold text-sm text-black'>{item.senderName.charAt(0)}</h4>
            </div> */}
            <div className='text-left'>
            <h4 className='font-popin font-semibold text-sm text-black'>{item.block}</h4>
                <h4 className='font-popin font-semibold text-sm text-black'>{item.blockby}</h4>


                {/* Block ke korse tar Account show korbe but jare block korse tar Account show korbena */}
                {!item.blockbyId && 
                    <div className='mx-auto mt-3'>
                        <button onClick={()=>handleUnblock(item)} className='font-popin font-bold text-white text-sm bg-heading px-5 py-1 rounded-md'>Unblock</button>
                    </div>
                }
                {item.blockbyId && 
                    <div className='mx-auto mt-3'>
                        <button className='font-popin font-bold text-white text-sm bg-rebbtn px-5 py-1 rounded-md'>Block Account</button>
                    </div>
                }
            </div>

            </div>
        ))}
    </div>)
    
)
}

export default BlockAccount