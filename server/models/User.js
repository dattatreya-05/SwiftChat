import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ //this is the user schema
    email : {
        type : String,
        required:true,
        unique:true
    },
    fullName: {
        type : String,
        required:true,
    },
    password : {
        type : String,
        required:true,
        minlength : 6
    },
    profilePic :{
        type: String,
        default : ""
    },
    bio:{
        type : String
    }
},
{timestamps : true} //jokhon notun ekta user create hbe tokhon automatically tokhoner date and time add hoe jabe
)

const User = mongoose.model("User",userSchema); //we created the user model

export default User;

//hitesh er khetre amra database e token o rakhchilam