import cors from "cors"
import "dotenv/config"
import express from "express"
import http from "http"
import { Server } from "socket.io"
import { connectDB } from "./lib/db.js"
import messageRouter from "./routes/messageRoutes.js"
import userRouter from "./routes/userRoutes.js"

//Create Express app and HTTP server
const app = express() //Handle routes (GET, POST, etc.), Handle middleware,Handle requests & responses,Define API logic
const server = http.createServer(app) //we are using http server as socket.io supports this http server //server handles receiving the request,Opening a port,Listening for connections

//Initialse socket.io server
export const io = new Server(server,{ //We are creating a Socket.IO server attached to our HTTP server,This allows real-time communication (chat, online users, etc.)
    cors:{origin: "*"}//"*" means → allow connection from any frontend URL,So any client can connect to this socket server
})

//store online users
/* When a user connects → we save their:
userId
socket.id */
export const userSocketMap = {} //{userId: socketId}    //This object stores which user is connected with which socket.

//socket.io connection handler
io.on("connection",(socket)=>{ //"connection" event runs every time a new user connects,socket = that specific user's connection //When someone connects, run this function.
    //step 1 : When frontend connects, it sends userId of that user who is connecting,we are grabbing that userId
    const userId = socket.handshake.query.userId;
    console.log("user connected",userId); //user connected 123 (123 is the userId)
    //step 2 : update the userSocketMap object
    if(userId){ //if userId exists then store that in the object
        userSocketMap[userId] = socket.id   //{ "123": "abc456socketid" } //{userId: socketId} in this format
    } //so this means Save this user(123) as online.

    //step 3 : Emit online users to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap)) //Send Online Users To Everyone...for example if this is the userSocketMap = {"123": "abc","456": "xyz"} then it returns ["123","456"]...basically all the online users are returned to all the clients

    socket.on("disconnect",()=> { //When User Disconnects(User closes browser/Internet disconnects/Logs out) then run this function
        console.log("user disconnected",userId); //user disconnected 123
        //step 4 : if user disconnects then delete the socket id
        delete userSocketMap[userId]; //before deletion userSocketMap = {"123": "abc","456": "xyz"} after deletion userSocketMap = {"456": "xyz"} //"123" is disconnected
        io.emit("getOnlineUsers",Object.keys(userSocketMap)) //Again Send Updated Online List
    })
})

//Middleware setup
app.use(express.json({limit: "4mb"}))//all request to the app will pass through json...we can upload images of maximum 4mb limit
app.use(cors())//it will allow all frontend url to connect with backend

//Routing
app.use("/api/status", (req,res) => res.send("server is live")) //when we will check this route http://localhost:3000/api/status then we will see "server is live"
app.use("/api/auth",userRouter)
app.use("/api/messages",messageRouter)

//Connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;

//starting of the server
if(process.env.NODE_ENV!=="production"){
    server.listen(PORT,() => {
    console.log(`server is running on port ${PORT}`)
})
}

//Export server for vercel
export default server