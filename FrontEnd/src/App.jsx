import Home from "../src/pages/Home"
import React from 'react'
import { BrowserRouter,Routes,Route } from "react-router-dom"
import Login from "../src/pages/Login"
import SignUp from "../src/pages/SignUp"
import Profile from "../src/pages/Profile"
import Dashboard from "../src/pages/Dashboard"
import MessageScreen from "../src/pages/MessageScreen"
import JobsSection from "./pages/JobsSection"
import CommunitiesSection from "./pages/CommunitiesSection"
import Projects from "../src/pages/Projects"
import UserProfile from '../src/pages/UserProfile'
import { UserProvider } from "./userContext.jsx"

export default function App() {
  return (
    <>

  <BrowserRouter>
    <UserProvider>
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/sign-up" element={<SignUp/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/profile" element={<Profile/>}/>
    <Route path="/dashboard/:id" element={<Dashboard/>}/>
    <Route path="/chat" element={<MessageScreen/>}/>
    <Route path="/jobs" element={<JobsSection/>}/>
    <Route path="/communities" element={<CommunitiesSection/>}/>
    <Route path="/projects" element={<Projects/>}/>
    <Route path="/profile/:userId" element={<UserProfile/>}/>
  </Routes>
    </UserProvider>
  </BrowserRouter>

  </>  
  )
}
