import express from "express";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";
import protectRoutes from "../middlewares/auth.js";


const messageRouter = express.Router()

messageRouter.get("/users",protectRoutes,getUsersForSidebar)
messageRouter.get("/:id",protectRoutes,getMessages) //  /:id is the id of the selected user
messageRouter.put("/mark/:id",protectRoutes,markMessageAsSeen) //  /:id is the id of the message
messageRouter.post("/send/:id",protectRoutes,sendMessage)

export default messageRouter

