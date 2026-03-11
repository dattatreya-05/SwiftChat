import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({ //this is the user schema
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
    },
    image:{
        type:String
    },
    seen:{
        type:Boolean,
        default:false
    }
},
{timestamps : true} //jokhon notun ekta user create hbe tokhon automatically tokhoner date and time add hoe jabe
)

const Message = mongoose.model("Message",messageSchema); //we created the user model

export default Message;

