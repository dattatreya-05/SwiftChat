import cloudinary from "../lib/cloudinary.js"
import Message from '../models/Message.js'
import User from '../models/User.js'
import { io, userSocketMap } from '../server.js'

//Controller to get all users except the logged in user
//with this function we will get the entire users list for sidebar and also number of unread messages for every users
//Returns all users except me + how many unread (unseen) messages each user has sent to me.
export const getUsersForSidebar = async(req,res) => {
    try {
        //step 1 : grab the id of the logged in user from req.user
        const userId = req.user._id

        //step 2 : filtering out users for users list in the sidebar
        //ebr bhalo bhabe dekh..when i am logging in to the chat-app tokhon ami users list e ki dekhbo? ami chara sob users ke dekhbo..mane jara jara log-in/signup koreche ba jara jara database e ache sobai ke dekhte pabo in the users list except me
        const filteredUsers = await User.find({_id:{$ne : userId}}).select("-password")//userId hochhe dhor amr id mane ami log-in korechi ebr ami chayi database er sobai ke dekhte amake chara in the users list tai amra oi logic tai lagiechi..database theke sei sokol sob user der find kore dao jader id not equal to userId(mane amr id)($ne : userId)..ne means not equal..eta korlei ami chara prottek user ke find kora hoye jabe karon ekamtro ami achi jar sathe ei condition ta satisfy korbe na baki sobar sathe korbe
        //filteredUsers is an array of user objects, where each object represents one user (except the logged-in user).

        //step 3 : count number of unseen messages
        const unseenMessages = {}
        /* ultimately erom type er object hbe eta
        {
            userId1 : 3,
            userId2 : 1
        }(means how many unseen messages from each user)
        */

        const promises = filteredUsers.map(async(user) => { //filteredUsers e amra loop through korle we will get all individual users except me
            const messages = await Message.find({ //ebr amra emon messages ke find korchi jetar receiver ami,sender onno keu and setar seen field ta is false
                senderId:user._id,
                receiverId : userId, //amar id mane ami i receiver
                seen: false
            })
            if(messages.length>0){
                unseenMessages[user._id] = messages.length
            }
        })
        await Promise.all(promises);//Wait until all users' unseen message counting is finished
        res.json({
            success : true,
            users : filteredUsers,
            unseenMessages
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            success : false,
            message: error.message
        })
    }
}
/* So messages is an array,It contains all unseen messages sent by a user to me...dhor user1(jar id abc123) amke 3 te message pathieche jei gulor seen are false
messages = [
    { text: "Hi" }, //baki fields r likhlam na for saving space
    { text: "Hello" },
    { text: "Where are you?" }
]
So messages.length = 3
unseenMessages[user._id] = messages.length          unseenMessages["abc123"] = 3
unseenMessages = {
    abc123: 3, //user1
    bcg667 : 5, //user 2
    .....
}
*/



//Controller to get all messages for selected user
// Gets full chat messages between me and the selected user and marks their messages as seen.
export const getMessages = async(req,res) => {
    try {
        //step 1 : grab the selected users id from req.params i.e the url
        const {id:selectedUserId} = req.params;
        //step 2 : grab logged in users id that is my id from req.user
        const myId = req.user._id
        //step 3: get all messages for selected user        mane where <1>sender is the selected one and receiver is me <2>sender is me and receiver is the selected one and
        const messages = await Message.find( //erom sob message find koro jekhane <1>sender is the selected one and receiver is me <2>sender is me and receiver is the selected one and
            {$or: [
                {
                    senderId:selectedUserId,
                    receiverId:myId
                },
                {
                    senderId:myId,
                    receiverId:selectedUserId
                }
            ]}
        )//messages is an array of objects where each object is a message

        //step 4 : ebar oi message gulo jetar sender hochhe selected user and receiver hochhe ami sei message gulo ke seen kore dao
        await Message.updateMany(
            {senderId:selectedUserId,receiverId:myId} , {seen : true}
        )//mane eta ki hochhe dekh..jokhon amra kono user ke select korbo mane chat ta khulbo tokhon message gulo of course seen hoe jabe..so oi seen:true oi update tai korlam

        res.json({
            success:true,
            messages
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            success : false,
            message: error.message
        })
    }
}



//Controller to mark particular message as seen using message id
//Marks one specific message as seen using its message ID.
export const markMessageAsSeen = async(req,res) => {
    try {
        //step 1 : grab the message id from req.params
        const {id} = req.params;
        //step 2 : find the particular message from database by the id and update it as seen:true
        await Message.findByIdAndUpdate(id,{seen:true})
        //step 3 : send response
        res.json({
            success:true
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            success : false,
            message: error.message
        })
    }
}


//Controller to send message to selected user..mane logged in user(mane ami) onno kono user ke message pathabo..basically creating a new message in the database
//Creates a new message (text/image), saves it in database, and instantly sends it to the receiver using socket.io.
export const sendMessage = async(req,res) => {
    try {
        //step 1 : grab the message text or image from frontend and selected user id/receiver id from req.params and senderId(my id) from req.user
        const {text,image} = req.body
        const receiverId = req.params.id
        const senderId = req.user._id
        let imageUrl;
        if(image){//step 2: if image exists then first upload it in cloudinary and get the url of the image
            const uploadResponse= await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        //step 3 : finally create the message
        const newMessage = await Message.create({
            senderId:senderId,
            receiverId:receiverId,
            text:text,
            image:imageUrl
        })
        //but now after creation of the message we want that message to be instantly displayed in the receivers chat in real time and for that we will use socket.io
        //so this is how receiver will instantly see the message
        const receiverSocketId = userSocketMap[receiverId] //suppose this is the userSocketMap = {"123": "socketA123","456": "socketB456"} and receiverId is 123...so userSocketMap["123"] will return the socketId of the receiver which is "socketA123"
        if(receiverSocketId){ //if socketId of the receiver exists ("socketA123") then the newMessage is emited to that particular receiverSocketId i.e the message will be instantly displayed in the receivers chat
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        res.json({
            success : true,
            newMessage
        })
    } catch (error) {
        res.json({
            success : false,
            message: error.message
        })
    }
}

/* Why do we need both getMessages() and markMessageAsSeen() when inside getMessages() messages are marked as seen for selected user ?
similarly in the getMessages() we are getting all the messages of a selected user and displaying all the messages but still in sendMessage() we are also displaying the newly sent message why?

🔹1> getMessages (Bulk update)

When I click on a user and open the chat:
All messages sent by that user to me
Automatically become seen: true
This is bulk marking (many messages at once).

🔹 2> markMessageAsSeen (Single update)

This is useful when:
A new message comes in real-time (socket)
And I instantly view it
Then frontend can call API to mark only that specific message as seen
This is single message marking.


Real-world example (WhatsApp logic)

When you:
when the chat is not open and you Open a chat → all unread messages turn blue ✔✔ (like getMessages)
Receive 1 new message while chat already open → that 1 message becomes seen (like markMessageAsSeen)

similarly when the chat is not open and you Open a chat -> all messages are displayed (work of getMessages())
Receive 1 new message while chat already open → that 1 message is displayed (work of sendMessage())

*/