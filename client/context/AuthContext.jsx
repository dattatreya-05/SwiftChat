/* Here we will write functions and state variables related to Authentication */

import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL //imported the backend url from .env file
axios.defaults.baseURL = backendUrl //made the backend url the base url of axios

//created the context
export const AuthContext = createContext()

//provide the context
export const AuthProvider = ({children}) => {
    const [token,setToken] = useState(localStorage.getItem("token"))//token initialises with the token which is present in the localstorage of the web browser
    const [authUser,setAuthUser] = useState(null) //by default initially there is no authenticated user..when user logs in then we will set the user as authenticated using setAuthUser
    const [onlineUsers,setOnlineUsers] = useState([])//initially an empty array i.e no online users //monehoy erom hbe onlineUsers = ["1a2","2j7","98u"] is an array containing userIds of online users(online users mane jader socket connected)
    const [socket,setSocket] = useState(null)

    //Login/Signup function to handle user authentication and socket connection
    const login = async(state,credentials) => {
        try {
            //step 1 : fetching the signup/login API from backend and getting the entire response as data
            const {data} = await axios.post(`/api/auth/${state}`,credentials) //if state is login then fetch the login API/controller and if state is signup then fetch signup API and credentials means fullName,email,password
            //step 2 : if success is true then set the user as the userData(which we are getting from the response) and connected the socket
            if(data.success){
                setAuthUser(data.userData)
                connectSocket(data.userData)
                axios.defaults.headers.common["token"] = data.token //so this line means we are adding the token in the headers and this is set as default mane it will will apply to all future axios requests. (token is generated during signup and login in the backend and we got that in response)
                setToken(data.token)
                localStorage.setItem("token",data.token) //local storage eo token ta rekhe dichhi
                toast.success(data.message)
            }
            else{
                toast.success(data.message)
            }
        } catch (error) {
            toast.error(error.message) /* so the error will come as a notification */
        }
    }
    
    //Check if user is authenticated or not and if so, set the user as authenticated user and connect the user with socket
    const checkAuth = async() => {
        try {
            //step 1 : we already built a controller function/API in the backend to check if user is authenticated or not so we will fetch that API path using axios and the controller function also returns a response which we are storing in a variable called data...so data = {success: true,user:req.user,message : "authenticated"}
            const {data} = await axios.get("/api/auth/check")
            //step 2 : if data.success is true then we will set the user as the authenticated user which is sent in response
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)//after user is set as the authenticated user then we have to connect that user to the socket as well
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message) /* so the error will come as a notification */
        }
    }


    //Logout function to handle user logout and socket disconnection
    const logout = async() => {
        //dekh login ache naki setar jonno amra barbar authentication middleware die pass korai and sekhane token ta amra grab kori from the headers...ebar jodi token ke localStorage and headers theke delete kore di taholei logout hoe jabe karon token r access korte parbe na manei logout
        localStorage.removeItem("token")
        setToken(null)
        setAuthUser(null)
        setOnlineUsers([])
        axios.defaults.headers.common["token"] = null //headers ke null kore dichi...i.e no token in headers
        toast.success("Logged out successfully")
        socket.disconnect() //logout er time e socket disconnect kore debo i.e offline hoe jabo
    }

    
    //Update profile function to handle user profile updates
    const updateProfile = async(body) => { //body te {profilePic,bio,name} eisob i pathabo
        try {
            //step 1 : fetch data from the  update profile API
            const {data} = await axios.put("/api/auth/update-profile",body)
            if(data.success){
                setAuthUser(data.user)
                toast.success("Updated profile successfully")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    //Connect Socket function : ei je opore je login function banalam..login er time ei amra socket ta connect kore dichhi mane setai obvious
    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return  /* If either userData does not exist(!userData) OR socket is already connected(socket?.connected), then stop here.  */
        //step 1 : new Socket banao using the user id of the authenticated user
        const newSocket = io(backendUrl,{
            query : {
                userId : userData._id //this means Hey backend, this user with the id "userData._id" is connecting.
            }
        })
        //step 2 : jei socket ta banalam otake connect kore dao
        newSocket.connect()
        //step 3 : socket state ke update kore dao with the new socket,Save the Socket in State
        setSocket(newSocket)
        //step 4 : on() means: “Listen for event”, When backend sends: "getOnlineUsers" then update the online user state using the id of the user , so our frontend knows Which users are currently online.
        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUsers(userIds) //monehoy erom hbe onlineUsers = ["1a2","2j7","98u"] is an array containing userIds of online users
        })
    }

    useEffect(() => {
        if(token){
            axios.defaults.headers.common["token"] = token
        }
        checkAuth() //we want the checkAuth() function to run only once at the very first thats why we kept this in the useEffect()
    },[])

    const value = {
        //whatever present in this object..we can access it anywhere in any component using this context
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}