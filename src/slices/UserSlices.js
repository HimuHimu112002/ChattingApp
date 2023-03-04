import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    // local store data store korar jonnno
    //localStorage.getItem("group")?JSON.parse(localStorage.getItem("group")):
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")):null,
    // gr: localStorage.getItem("gr") ? JSON.parse(localStorage.getItem("gr")):null,
    active:localStorage.getItem("active")?JSON.parse(localStorage.getItem("active")):null,
    // group:null,
    countnoti:localStorage.getItem("countnoti")?JSON.parse(localStorage.getItem("countnoti")):null,
  },
  reducers: {
    userLoginInfo: (state, action) => {
      // user name,,,, user email,,,,, profile picture akhane store hobe
        state.userInfo = action.payload

    },
    
    singleSms: (state,action)=>{
      state.active = action.payload
    },
    counts: (state,action)=>{
      state.countnoti = action.payload
    },
    
  },
})

// Action creators are generated for each case reducer function
export const {userLoginInfo,groupr, singleSms, counts, groupsms} = userSlice.actions

export default userSlice.reducer