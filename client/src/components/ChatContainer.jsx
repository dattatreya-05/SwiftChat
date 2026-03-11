/* this is the chatting space */

import { useContext, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { AuthContext } from '../../context/AuthContext.jsx'
import { ChatContext } from '../../context/ChatContext.jsx'
import assets from '../assets/assets.js'
import { formatMessageTime } from '../lib/utils.js'

function ChatContainer() {

    const {authUser,onlineUsers} = useContext(AuthContext)
    const {messages,selectedUser,setSelectedUser,sendMessage,getMessages} = useContext(ChatContext)

    const scrollEnd = useRef() //through scrollEnd we can access the div which has ref={scrollEnd}

    //Component loads -> useEffect runs once (because of []) -> It checks if the element(the div which has reference scrollEnd) exists -> If yes → then it will smoothly scroll the webpage upto the div which has reference scrollEnd
    //whenever there will be any changes to messages that is a new message is sent then automatically the webpage will be scrolled upto the new message
    useEffect(() => {
        if(scrollEnd.current && messages){
            scrollEnd.current.scrollIntoView({behavior : "smooth"})
        }
    },[messages])

    const [input,setInput] = useState('')//this is the state where message texts will be stored

    //Handle sending a message (in text format)
    const handleSendMessage = async(e) => {
        e.preventDefault();
        if(input.trim() === "") return null
        await sendMessage({text : input.trim()});
        setInput("")
    }

    //Handle sending an image
    const handleSendImage = async(e) => {
        const file = e.target.files[0]
        if(!file || !file.type.startsWith("image/")){
            toast.error("select an image file")
            return;
        }
        const reader = new FileReader()
        reader.onloadend = async() => {
            await sendMessage({image : reader.result})
            e.target.value = ""
        }
        reader.readAsDataURL(file)
    }

    //getMessages tokhoni called hbe jokhon selectedUser change hbe..of course jokhon selected user change hbe tokhoni amra sei user er jonno sob messages get korbo
    useEffect(() => {
        getMessages(selectedUser?._id)
    },[selectedUser])

    

    return selectedUser ? ( /* when selectedUser is true then only we will return this div */
        <div className='h-full overflow-scroll relative backdrop-blur-lg'>
            {/* -------- HEADER -------- */}
            <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">{/* this div contains the user profile pic,user name(basically the topmost part of the chatting space) */}
                <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full'/> {/* the profile pic   img src={selectedUser?.profilePic} //eta korle jei user ta ke select korchi setari image dekhabe */}
                <p className='flex-1 text-lg text-white flex items-center gap-2'> {/* the name and the green dot */}
                    {selectedUser.fullName} {/* {selectedUser?.fullName} eta korle jei user ta ke select korchi setari name dekhabe */}
                    {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-600'></span> }{/* this span tag does nothing but just adds a green dot if the selected user is online*/}
                </p>
                <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7'/> {/* arrow image which is hidden for larger screens..it is the back arrow icon */}
                <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />{/* the i icon */}
            </div>
            {/* -------- CHAT-AREA -------- */}
            <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
                {messages.map((msg,index) => (/* messages is an array where each element is each message..so we are looping through the array and "msg" is each element of the array(which is an object containing many properties like senderId,receiverId,text etc  */          /*FOR FRONTEND ONLY: messagesDummyData is an array which we only created where each element is each message..so we are looping through the array and "msg" is each element of the array(which is an object containing many properties like senderId,receiverId,text etc */
                    <div
                    key={index} className={`flex items-end gap-2 justify-end ${msg.senderId!== authUser._id && 'flex-row-reverse'}`} /* flex-row-reverse -> It makes flex items arrange horizontally (row) but in reverse order...mane jodi message er sender authenticated user(je logged in user mane ami nijei) NA hoy,mane sender ta jodi selectedUser hoy then selectedUser er sent messages er khetre flex-row-reverse lagao */
                    >{/* ei div e amra chats and images show korchi in the chatting area and also showing profile or the avatar icons beside the messages and the timing of the messages sent  */}
                        {msg.image ? ( /* so jodi msg.image exist kore then show images or else show the texts  */
                            <img src={msg.image} alt="" className='max-w-57.5 border border-gray-700 rounded-lg overflow-hidden mb-8'/>
                        ) : (
                            <p className={`p-2 max-w-50 md:text-sm font-light rounded-lg mb-8 break-all bg-[#004000] text-white
                            ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}
                            `}>
                                {msg.text}
                            </p> /* rounded-br-none → remove bottom-right border radius(amar pathano message gulor jonno eta howa uchit) */
                        )}
                        <div className='text-center text-xs'> {/* this div shows the profile or the avatar icons beside the messages and also the timing of the messages sent */}
                            <img src={msg.senderId === authUser._id ? authUser.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt=""
                            className='w-7 rounded-full' />
                            <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
                        </div>
                    </div> /* ei div e amra chats and images show korchi in the chatting area and also showing profile or the avatar icons beside the messages and the timing of the messages sent  */
                ))}
                <div ref={scrollEnd}></div>
            </div> {/* ei div e amra chats and images show korchi in the chatting area and also showing profile or the avatar icons beside the messages and the timing of the messages sent */}
            {/* -------- BOTTOM AREA(THE CHATTING INPUT BOX) -------- */}
            <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
                <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'> {/* this div contains the input field for typing message and uploading picture */}
                    <input onChange={(e) => setInput(e.target.value)} value={input} onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null} /* onKeyDown runs whenever you press any key in the keyboard while typing in the input field...When any key is pressed inside the input box, check if it is the Enter key...If yes → send the message,If not → do nothing.*/
                    type="text" placeholder="Send a Message"
                    className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'
                    /> {/* input field for typing message */} {/* flex-1 makes the element take the entire space of the row */}
                    <input onChange={handleSendImage} type="file" id="image" accept='image/png, image/jpeg' hidden/>{/*input field for uploading files(accepted in png and jpeg only)  */}
                    <label htmlFor="image"> {/* the file type input field will be hidden and there we used "image" as id..and this label has htmlFor="image" so when we click the label(the image inside the label) then the file input field will open...htmlFor connects a label to an input in React. */}
                        <img src={assets.gallery_icon} alt=""  className='w-5 mr-2 cursor-pointer'/>
                    </label>
                </div>
                <div>{/* this div contains the send btn image */}
                    <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer' />
                </div>
            </div>
        </div>
    ) : ( /* when selectedUser is false that is no user is selected then we will return this div(only showing the logo,and a text) */
            <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
                <img src={assets.logo_big} alt="" className='max-w-16'/>
                <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
            </div>
    )
    
}

export default ChatContainer
