import { useContext } from "react"
import { Toaster } from "react-hot-toast"
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext.jsx"
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'


function App() {
  const {authUser} = useContext(AuthContext)
  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain"> {/* we want the background image in every pages and components thats why we mentioned in the App so that the entire website is covered  */}
    <Toaster /> {/* this is for notification */}
      <Routes>
        {/*if user is authenticated (already logged in) then the user cant access LoginPage,only home and profile page can be accessed and if the user is not authenticated then user cant access HomePage and ProfilePage */}
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />}/>{/* if authUser is true i.e user is authenticated then only he can access the homepage else navigated to profile page */}
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" /> }/>{/* if !authUser is true i.e ultimately authUser is false i.e user is not authenticated then only he can access the login page else navigated to home page */}
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />}/>
      </Routes>
    </div>
  )
}

export default App

