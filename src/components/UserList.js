import React, { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { TiTick } from 'react-icons/ti';
import { BiSearch } from 'react-icons/bi';
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from 'react-redux';

const UserList = () => {
    const db = getDatabase();
    let data = useSelector((state)=> state.userLoginInfo.userInfo);
    let [userdata, setUserData] = useState([])
    let [SearchArray, setSearchArray] = useState([])
 
    let [FriendrequestList, setFriendrequestList] = useState([])
    let [FriendList, setFriendList] = useState([])
    let [BlockBack, setBlockBack] = useState([])

    // Current user friend list show korebena START CODE =====================>

    useEffect(()=>{
        const userRef = ref(db, 'user/');
        onValue(userRef, (snapshot) => {
        let arry = [];

        snapshot.forEach((item)=>{
            // je login thakbe tar key mile jabe so login user er list show korbena
            // login user sara sokoler information show korbe
            if(data.uid != item.key){ 
                arry.push({...item.val(), userid: item.key})
                // spread oparetor use kora hoiyese karon sokol user der id show koranor jonno
            }
        })
        setUserData(arry)
    });
    },[])

    // Current user friend list show korebena END CODE =====================>

    // Current user friend request pathalo START CODE =====================>
    let handleFriendRequest =(item)=>{
        set(push(ref(db, 'Friendrequest')), {
            // ke request pathalo and ke rechived korlo ader dujoner name and id nilam
            senderName: data.displayName,
            senderId: data.uid,
            // je login thakbe se sender hobe so data theke sendername and id nilam 
            rechiverName: item.username,
            rechiverId: item.userid,
            // item theke rechiverName and id nilam

            notification:`${data.displayName} Sent you friend request`
        });
    }

    // friendRequest pathalo kina seita handle korar jonno and Friend request guli database store korte hobe
    // Friendrequest pathale database store hobe then useEffect use kore data ante hobe and friendRequestarry
    // array te store korte hobe
    useEffect(()=>{
        const FriendRequestRef = ref(db, 'Friendrequest');
        onValue(FriendRequestRef, (snapshot) => {
        let friendRequestarry = [];
        snapshot.forEach((item)=>{
            friendRequestarry.push(item.val().rechiverId + item.val().senderId)
            //console.log("reciver", item.val().rechiverId + item.val().senderId)
        })
        setFriendrequestList(friendRequestarry)
    });
    },[])

    // friend hoise kina seita handle korar jonno friend hole friend dekhabe and na hole pending dekhabe
    useEffect(()=>{
        const FriendRef = ref(db, 'FriendAccept');
        onValue(FriendRef, (snapshot) => {
        let friendarry = [];
        snapshot.forEach((item)=>{
            friendarry.push(item.val().rechiverId + item.val().senderId)
            
        })
        setFriendList(friendarry)
    });
    },[])

    // unblock korle abar friendList show korbe
    useEffect(()=>{
        const FriendRef = ref(db, 'block');
        onValue(FriendRef, (snapshot) => {
        let friendarry = [];
        snapshot.forEach((item)=>{
            friendarry.push(item.val().blockId + item.val().blockbyId)        
        })
        setBlockBack(friendarry)
    });
    },[])

    let handleUserListSearch=(e)=>{
        let SearchFilterArray = []
        if (e.target.value.length == 0) {
            setSearchArray([])
            // array value faka thakle sokol userlist data dekhabe 
        }else{
            userdata.filter((item)=>{
                if(item.username.toLowerCase().includes(e.target.value.toLowerCase())){
                    SearchFilterArray.push(item)
                    setSearchArray(SearchFilterArray)
                }
            })
        }
    }

  return (
    <div className='shadow-lg w-full relative border mt-3 px-5 py-3 rounded-lg h-[431px] overflow-y-scroll'>
        <h3 className='text-xl font-semibold font-popin text-black'>User List</h3>
        <BsThreeDotsVertical className='absolute top-[15px] right-2'></BsThreeDotsVertical>

        {/* Search Section */}

        <div className='relative'>
            <input onChange={handleUserListSearch} className='mt-4 drop-shadow-md px-9 py-3 outline-0 rounded-lg w-full' type="text" placeholder='Search'></input>
            <BiSearch className='absolute top-[33px] left-3'></BiSearch>
            <BsThreeDotsVertical className='absolute top-[33px] right-3'></BsThreeDotsVertical>
        </div>

        {/* Search Section */}


        {SearchArray.length > 0 ?
            (SearchArray.map((item)=>(
            <div className='flex gap-x-5 items-center border-b border-solid border-loginbtn pb-3.5'>
            <div className='hidden md:block mt-2 px-5 py-5 rounded-md border border-1 border-green-700'>
                <h4 className='font-popin font-semibold text-sm text-black'>{item.username.charAt(0)}</h4>
            </div> 
            <div className='text-left'>
                <h4 className='font-popin font-semibold text-sm text-black'>{item.username}</h4>

                <div className='mx-auto mt-2'>           

                {BlockBack.includes(item.userid + data.uid) || BlockBack.includes(data.uid + item.userid)?(<button className='bg-rebbtn px-5 py-1 rounded-md text-white text-sm font-semibold flex'>Block</button>): 
                FriendList.includes(item.userid + data.uid) || FriendList.includes(data.uid + item.userid)
                ?(<button className='bg-grcolor px-5 py-1 rounded-md text-white text-sm font-semibold flex'>Friend <TiTick className='mt-[2px] ml-2'></TiTick></button>)
                :FriendrequestList.includes(item.userid + data.uid) || FriendrequestList.includes(data.uid + item.userid) ? (<button className='bg-loginbtn px-5 py-1 rounded-md text-white text-sm font-semibold'>pending</button>)
                :(<button onClick={()=>handleFriendRequest(item)} className='bg-loginbtn px-5 py-1 rounded-md text-white text-sm font-semibold'>Friend Request</button>)               
                }               
               </div>
            </div>     
            </div>
        )))
        
        :
        
        (userdata.map((item)=>(
            <div className='flex gap-x-5 items-center border-b border-solid border-loginbtn pb-3.5'>
            <div className='hidden md:block mt-2 px-5 py-5 rounded-full border border-1 border-green-700'>
                <h4 className='font-popin font-semibold text-sm text-black'>{item.username.charAt(0)}</h4>
            </div>
            <div className='text-left'>
                <h4 className='font-popin font-semibold text-sm text-black text-capitalize'>{item.username}</h4>
                <div className='mx-auto mt-2'>           

                {BlockBack.includes(item.userid + data.uid) || BlockBack.includes(data.uid + item.userid)?(<button className='bg-rebbtn px-5 py-1 rounded-md text-white text-sm font-semibold flex'>Block</button>): 
                FriendList.includes(item.userid + data.uid) || FriendList.includes(data.uid + item.userid)
                ?(<button className='bg-grcolor px-5 py-1 rounded-md text-white text-sm font-semibold flex'>Friend <TiTick className='mt-[2px] ml-2'></TiTick></button>)
                :FriendrequestList.includes(item.userid + data.uid) || FriendrequestList.includes(data.uid + item.userid) ? (<button className='bg-loginbtn px-5 py-1 rounded-md text-white text-sm font-semibold'>pending</button>)
                :(<button onClick={()=>handleFriendRequest(item)} className='bg-loginbtn px-5 py-1 rounded-md text-white text-sm font-semibold'>Friend Request</button>)               
                }               
               </div>
            </div>     
            </div>
        )))}
        
    </div>
)
}

export default UserList