/* the media section */
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import { ChatContext } from '../../context/ChatContext.jsx'
import assets from '../assets/assets.js'
function RightSidebar() {

    const {selectedUser,messages} = useContext(ChatContext)
    const {logout,onlineUsers} = useContext(AuthContext)
    const [msgImages,setMsgImages] = useState([]) //msgImages is an array where we will store the image urls of all the images sent to a selected user

    //Get all the images from the messages and set them to state
    useEffect(()=>{ /* messages is an array which contains each message(each message being an object "msg") */
        setMsgImages(
            messages.filter(msg => msg.image).map(msg => msg.image) /* ekhane amra jeta korchi seta hochhe...first puro messages array theke amra serom "msg"(objects) ke filter out korchi jekhane "image" property ta ache(mane not empty) and sei filtered out objects gulo ke nie ekta new array toiri hbe..and jei new filtered array ta pabo setay loop through kore amra prottek "msg"(object) er image property ta extract korbo and msgImages array te store korbo  */
        )
    },[messages])

    return selectedUser && ( /* jodi selectedUser true hoy mane user is selected..taholei amra eta return korbo */
        <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}> {/* Since this component already renders only when selectedUser is true, the ternary inside className is technically unnecessary. we can just write className="bg-[#8185B2]/10 ..... max-md:hidden" */}
            <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>{/* this div contains the first part that is users photo,name,bio */}
                <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-square rounded-full'/> {/* users photo */}
                <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
                    {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p> } {/* this is nothing but just the green dot to show online and amra tokhoni eta show korbo jokhon user ta online thakbe(onlineUsers array will contain the selected users id) */}
                    {selectedUser.fullName} {/* the users name */}
                </h1>
                <p className='px-10 mx-auto'>{selectedUser.bio}</p> {/* users bio */}
            </div>{/* this div contains the first part that is users photo,name,bio */}

            <hr className='border-[#ffffff50] my-4'/> {/* this is just a horizontal line */}

            <div className='px-5 text-xs'>
                <p>Media</p>
                <div className='mt-2 max-h-50 overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>{/* we will do this so that the images will be shown in grid format(in 2 columns) */}
                    {msgImages.map((url,index) => (                      /* FOR FRONTEND ONLY : imagesDummyData is an array where each element is each image..so we are looping through the array and "url" is each element of the array(apatoto element gulo ekta image format ei ache i.e in png format but i think jokhon backend korbo tokhon image(.png file) na pathie amra image er url ta ke pathabo)  */
                        <div key={index} onClick={() => window.open(url)}
                        className='cursor-pointer rounded'
                        > {/* click korle ekta seperate window te url(image) ta khulbe */}
                            <img src={url} alt="" className='h-full rounded-md'/>
                        </div>
                    ))}
                </div>
            </div> {/* this div contains the images of the media */}
            
            <button onClick={() => logout()}
            className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-green-400 to-green-600 text-white
            border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'
            >
                Logout
            </button>{/* the logout button */}
        </div>
    )
}

export default RightSidebar