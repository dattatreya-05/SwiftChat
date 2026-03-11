/* this is the left column of the homepage that is the users list */
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import { ChatContext } from '../../context/ChatContext.jsx'
import assets from "../assets/assets.js"

function Sidebar() { //{selectedUser,setSelectedUser} etake amra props hisebe accept korchilam when making the frontend only
    const {logout,onlineUsers} = useContext(AuthContext)

    const {getUsers,users,selectedUser,setSelectedUser,unseenMessages,setUnseenMessages} = useContext(ChatContext)

    const [input,setInput] = useState(false)

    const filteredUser = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users //logic ta bojh
    //dekh jodi input false hoy mane ami kichu search korlam na then filteredUser = users  mane jara jara ache users logged-in sobai ke left sidebar e dekhao (of course amke chara)
    //ebr dhor ami search box e kono user er name seach korlam mane input is true then puro je users array ache sekhane eta check koro je kon user er
    //fullName includes the input(mane input e jeta dewa hochhe) sei user ta ke sudhu filter out koro
    //mane dhor ami search korlam Ramesh tahole filteredUser = [{fullName : "Ramesh","email":"ramesh@gmail.com"....}] //jeta search korlam sei object tai thakbe sudhu array te..oi object tai sudhu filtered out hoeche
    //r jodi ami search na kori then filteredUser = [{fullName : "Ramesh",...},{fullName : "Suresh",...}] //mane je kota user ache sobkotai thakbe filteredUser array te


    useEffect(()=> {
        getUsers()
    },[onlineUsers])//onlineUsers change hole call the function...and eta kokhon kokhon change hote pare? dhor notun kono user signup korlo , tarmane socket er sathe connected holo i.e online holo so update the onlineUsers array and call the function jate new jei user ta signup korlo takeo amra get kore sidebar e show korte pari

    const navigate = useNavigate() /* navigate is used for navigating from one page to another by moving from one path to another by changing url  */

    return (
        <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white
        ${selectedUser ? "max-md:hidden" : ""}`}
        > {/* md:hidden = medium screen and above e hide koro , max-md: = below medium screen hide koro ,so etar mane Hide this element on screens smaller than md (mobile screens) but on md(768px) and above(laptop screens) show this element  */}
            <div className="pb-5"> {/* this div contains 2 divs carrying "SwiftChat",menu icon(along with hovering texts),search user input box */}
                <div className="flex justify-between items-center"> {/* this div contains the "SwiftChat" and a div */}
                    <h8 className="mt-2 text-2xl font-semibold text-white">SwiftChat</h8>{/* <img src={assets.logo} alt="logo" className="max-w-40" /> */}
                    <div className="relative py-2 group"> {/* this div contains the menu icon(the 3 dots) and the things when hovered over menu icon  */}
                        <img src={assets.menu_icon} alt="menu" className="max-h-5 cursor-pointer" /> {/* this is the menu icon image */}
                        <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#214228] border border-gray-600 text-gray-100 hidden group-hover:block'
                        > {/* initially this div i.e its children(the paragraphs like edit profile,logout) will be hidden due to the class "hidden" mentioned..but when we hover over the menu icon then these will be visible and this happens due to the className="group" which is applied in the parent div and in this div we kept className="group-hover:block" */}
                            <p className="cursor-pointer text-sm" onClick={() => navigate('/profile')}>Edit Profile</p> {/* when we will click on the "Edit Profile" paragraph then we will be navigated to the /profile url i.e profile page     we could use link/navLink also */}
                            <hr className="my-2 border-t border-gray-500"/> {/* this is nothing but just a horizontal line */}
                            <p className="cursor-pointer text-sm" onClick={() => logout()}>Logout</p>
                        </div>
                    </div>
                </div> {/* this div contains the menu icon(the 3 dots) and the texts which will be visible when hovered over the menu icon(edit profile,logout) */}
                <div className='bg-[#214228] flex items-center gap-2 rounded-full py-3 px-3 mt-5'>
                    <img src={assets.search_icon} alt="Search" className='w-3' />
                    <input onChange={(e) => setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1'
                    placeholder='Search User'/>
                </div> {/* this div contains the search user input box */}
            </div>
            <div className='flex flex-col'>
                {filteredUser.map((user,index) => ( /* filteredUser is an array where each element is each user...so we are looping through the array and "user" is each element of the array(which is an object containing many properties like fullname,profile_pic,email etc) */                        /*FOR FRONTEND ONLY : userDummyData is an array(which we are getting from the assets[amrai baniechi array ta ke]) where each element is each user..so we are looping through the array and "user" is each element of the array(which is an object containing many properties like fullname,profile_pic,email etc) */
                    <div onClick={() => {setSelectedUser(user); setUnseenMessages(prev=> ({...prev,[user._id] : 0}))}} /* particular user e click korle selectedUser ta becomes sei particular user jetar opor click kora holo   setUnseenMessages(prev=> ({...prev,[user._id] : 0})) etar mane hochhe amra jokhon particular user tay click korbo tokhon sei particular user tar jonno unseenMessages 0 hoye jawa uchit...otai korchi...unseenMessages er previous ja ja chilo oi gulo as it is copy paste kore dao just selected user er jonno 0 kore dao  */
                    key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm
                    ${selectedUser?._id === user._id && 'bg-[#214228]/50'}`
                    }> { /* this means je jodi selectedUser is true then jodi selectedUser and particular ei user er id ta match kore jay tahole sei user er khetre ei background ta add kore dao r seta match korbei karon onClick e amra setSelectedUser(user) eta korchi jeta automatically mean korche selectedUser = user  so 2 tor id o match korte badhho..so click korlei selectedUser and user same hoe jabe and 2 tor id match kore jabe and bg color add ow jabe */
                        /* in this div we are making the profile pic,then the fullname */}
                        <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-8.75 aspect-square rounded-full '/> {/* this is for the profile pics */}
                        <div className='flex flex-col leading-5'>{/* this is for the full name of the user showing and the online offline thing */}
                            <p>{user.fullName}</p>
                            {
                                onlineUsers.includes(user._id) /* mane jodi onlineUsers array te ei particular user er id exist kore(included thake) then show online and jodi na thake then show offline */             /*For FRONTEND ONLY :index<3 */
                                ? <span className='text-green-400 text-xs'>Online</span> /* if index is less than 3..that is for first 3 elements it will be online */
                                : <span className='text-neutral-400 text-xs'>Offline</span> /* and for the rest it will be offline */
                            }
                        </div>
                        {unseenMessages[user._id]>0 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50 '>{unseenMessages[user._id]}</p>}{/* jodi ei particular user jonno er unseen messages > 0 thake then show it */}      {/*FOR FRONTEND ONLY:  ekta interesting jinis hochhe ekhane && mane bolte chaichi je if index is greater than 2 then include this paragraph  */}
                    </div>
                ))}
            </div>{/* this div contains the users list */}
        </div>
    )
}

export default Sidebar
