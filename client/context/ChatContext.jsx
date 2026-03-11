import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext()

export const ChatProvider = ({children}) => {
    const [messages,setMessages] = useState([]) //here we will store all the messages for selected user..messages is an array of object..each object being a message
    const [users,setUsers] = useState([]) //here we will store the users for left sidebar..users is an array of objects..each object being an user
    const [selectedUser,setSelectedUser] = useState(null) //here we will store the user id of the selected user..mane kono user ke select korle tar chat container ta khule jabe and ami tar sathe chat korte parbo
    const [unseenMessages,setUnseenMessages] = useState({}) //here we will store unseen messages in this format {"1a2": 4, "8i6" : 6} //mane kon user er jonno kota unseen message

    const {socket,axios} = useContext(AuthContext)

    //Function to get all users for the sidebar (ami chara database er sob user) and all the unseenMessages for each particular user of the sidebar in this format {userId : no_of_unseenMessages}
    const getUsers = async() => {
        try {
            const {data} = await axios.get("/api/messages/users")
            if(data.success){
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages) /* this will be an object in a key value pair form for eg {"1a2": 4, "8i6" : 6} */
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    
    //Function to get messages for selected user
    const getMessages = async(userId) => { //we have to send the user id of the selected user..in the backend we are grabbing it from req.params
        try {
            const {data} = await axios.get(`/api/messages/${userId}`) //amra jodi function e userID na pathie direct erom kortam taholeo monehoy hoto  const {data} = axios.get(`/api/messages/${selectedUser._id}`)
            if(data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    //Function to send message to selected user
    const sendMessage = async(messageData) => { //messageData mane {text,image}
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`,messageData)
            if(data.success){
                setMessages((prevMessages) => [...prevMessages,data.newMessage]) //mane purono previous messages ja ache oi gulo as it is copy paste hoye jao tarpor ei new message ta ke add koro in the array
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    //Function to subscribe to messages for selected user
    /* 🔹 What is the purpose of this function?
    This function:
    Listens for new messages from socket //jei notun message ta asche amr kache(logged in user er kache) setake seen hisebe mark korbo naki unseen hisebe?
    Decides:
    If chat window is open → mark message as seen //mane if message.sender = selectedUser //mane je message ta pathachhe takei select kore rekhechi amra..tar chat window tai khola ache
    If chat window is not open → increase unseen message count */
    const subscribeToMessages = async() => {
        if(!socket) return; //If socket is not connected, stop the function.
        socket.on("newMessage",(newMessage) => { //Whenever server sends a new message, this function runs.
            if(selectedUser && newMessage.senderId === selectedUser._id){ //so suppose a new message is sent and the senderId is equal to selectedUser's id i.e oi user tar i chat window khola chilo tahole seen mark kore dite hbe message ta ke
                newMessage.seen = true;
                setMessages ((prevMessages) => [...prevMessages,newMessage] )
                axios.put(`/api/messages/mark/${newMessage._id}`) //for this particular message(newMessage._id) the seen property will be marked as true
            }
            else{ //so suppose a new message is sent but the senderId is not equal to selectedUser's id then that new message will be unseen so update the unseenMessages object
                setUnseenMessages((prevUnseenMessages) => (
                    {...prevUnseenMessages,
                        [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1 //lets try to understand the logic of this line
                        //previous unseen messages gulo as it is copy-paste hoe jao,tarpor ei format e object ta ke banao {userId : no_of_unseenMessages} so ebar dekh [newMessage.senderId] this is the userId part
                        //ebar amra check korbo already ei user tar kono unseen messages ache naki jodi theke thake tahole setake increment korbo by 1 r jodi na thake tahole sudhu 1 korbo..mane 1 ta unseen message
                    }))
            }
        })
    }

    //Function to unsubscribe to messages
    /* Why needed?
    Because:
    This removes the listener.
    If component reloads multiple times and you don't remove listener,
    the message will be received multiple times.
    So this prevents duplicate messages. */
    const unsubscribeFromMessages = async() => {
        if(socket) socket.off("newMessage")
    }


    //when socket and selected user changes then this functions will run
    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages()
    },[socket,selectedUser])


    const value = {
        messages,users,selectedUser,unseenMessages,
        setMessages,setSelectedUser,setUnseenMessages,
        getUsers,sendMessage,getMessages
    }
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}


