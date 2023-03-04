import { createSlice } from '@reduxjs/toolkit'

export const activeChatSlices = createSlice({
  name: 'actives',
  initialState: {
    //userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")):null,
    active: "himugggggg"
  },
  reducers: {
    activeChat: (state, action) => {
        state.active = action.payload

    },
    
  },
})

// Action creators are generated for each case reducer function
export const {activeChat} = activeChatSlices.actions

export default activeChatSlices.reducer