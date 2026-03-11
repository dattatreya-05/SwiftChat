//middleware is the function that executes before the execution of controller function

import jwt from "jsonwebtoken";
import User from '../models/User.js';

//Middleware to protect routes so that if user is authenticated then only the user can use the routes(each route taking to each controller function)
const protectRoutes = async(req,res,next) => {
    try {
        //step 1 : grabbing the token from the headers of the request or the frontend
        const token = req.headers.token;
        //step 2 : decode the token using jwt secret key
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        //step 3: find the user by id from the database(id is extracted from the decoded token)
        const user = await User.findById(decoded.userID).select("-password") //we are not selecting the password field of the user
        //step 4 : check if user exits or not
        if(!user){
            return res.json({success:false,message:"User not found"})
        }
        //step 5 : we will add the user data in the request so that we can use the user in the controller
        req.user = user;
        next(); // after this middleware the controller function will run next
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

export default protectRoutes