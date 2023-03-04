import { configureStore } from '@reduxjs/toolkit'
// import folder directory
import UserSlices from './slices/UserSlices'
//import ActiveChatSlice from './activeSingleSms/ActiveChatSlice'
export default configureStore({
  reducer: {
    userLoginInfo:UserSlices,

  },
})