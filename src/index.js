import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import firebaseConfig from "./firebaseConfig"
import 'react-toastify/dist/ReactToastify.css';
import {createBrowserRouter,RouterProvider,Route,} from "react-router-dom";
import Registration from './pages/registration/Registration';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import Forget from './pages/forgetPassword/Forget';
import store from './store';
import { Provider } from 'react-redux'
import GroupCreate from './components/GroupCreate';
import GroupRequest from './components/GroupRequest';
import Notifications from './pages/notifications/Notifications';
import Setting from './pages/setting/Setting';
import  Message  from './pages/message/Message';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "/registration",
    element: <Registration></Registration>,
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/forgetPassword",
    element: <Forget></Forget>,
  },
  {
    path: "/groupCreate",
    element: <GroupCreate></GroupCreate>,
  },
  {
    path: "/grouprequest",
    element: <GroupRequest></GroupRequest>
  },
  
  {
    path: "/notifications",
    element: <Notifications></Notifications>
  },
  {
    path: "/setting",
    element: <Setting></Setting>
  },
  {
    path: "/message",
    element: <Message></Message>
  },
  
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
     
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>

);
