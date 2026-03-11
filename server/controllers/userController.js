import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import generateToken from "../lib/utils.js";
import User from "../models/User.js";


//Signup a new user
export const signup = async(req,res) => {
    //step 1 : grab details like email,password etc from frontend or req.body
    const {fullName,email,password,bio} = req.body;
    try {
        //step 2 : checking je sobkota field dieche naki
        if(!fullName || !email || !password ||!bio){ //checking je sobkota field dieche naki
            return res.json({success: false , message : "Missing details"})
        }
        //step 3: checking je user already exist kore naki using email
        const user = await User.findOne({email}) //email die find korlam user ta ke from the database but this user should not exist
        if(user){
            return res.json({success: false , message : "Account already exists"})
        }
        //step 4: password ta ke hash kore databse e save kora
        const salt = await bcrypt.genSalt(10) //10 rounds of hashing
        const hashedPassword = await bcrypt.hash(password,salt)//password ta ke hash korlam
        //step 5 : creating the user in database
        const newUser = await User.create({
            fullName : fullName,
            email : email,
            password :  hashedPassword,
            bio : bio
        })
        //step 6 : after creation of the user in the database create token for authentication
        const token = generateToken(newUser._id) //sign up er somoy tei created a token

        //step 7: returning response
        res.json(     //hitesh er code ta aro modified chilo mane amra return je korchilam newUser okhane amra password eisob ke bad die return korchilam...oi .select("password") kore
            {success : true,
            userData : newUser,//this is basically the created user
            token : token,
            message : "Account created successfully"
            }
        )
    } catch (error) {
        console.log(error.message);//so that we can see the error in the terminal also
        res.json(
            {
            success : false,
            message : error.message
            }
        )
    }
}

//Controller to login a User
export const login = async(req,res) => {
    try {
        //step 1: grabbing details from frontend or req.body
        const {email,password} = req.body;
        //step 2 : finding the user from database by email
        const userData = await User.findOne({email})
        //step 3 : check if user exists or not
        if(!userData){
            return res.json({
                success:false,
                message : "user does not exits"
            })
        }
        //step 4 : checking if the password given by user is correct or not(will match with the hashed one present in database)
        const isPasswordCorrect = await bcrypt.compare(password,userData.password)//it will return true or false..match korle true else false
        if(!isPasswordCorrect){
            return res.json({
                success:false,
                message : "Invalid credentials(password)"
            })
        }
        //step 5 : after logging of the user create token for authentication
        const token = generateToken(userData._id) //login er somoy created a token

        //step 6: returning response
        res.json(
            {success : true,
            userData : userData,
            token : token,
            message : "Logged in successfully"
            }
        )
    } catch (error) {
        console.log(error.message);//so that we can see the error in the terminal also
        res.json(
            {success : false,
            message : error.message
            }
        )
    }
}

//Controller to check if user is authenticated
export const checkAuth = (req,res) => {
    res.json({
        success: true,
        user:req.user,
        message : "authenticated"
    })
}

//Controller to update user profile details
export const updateProfile = async(req,res) => {
    try {
        //step 1 :grab the details from the frontend which is to be updated
        const {profilePic,bio,fullName} = req.body;
        //step 2: grab the id from req.user //dekh already singup/login kora hoe geche that means there is certainly a jwt token which i can decode and extract the id in the auth middleware
        const userId= req.user._id;
        let updatedUser;
        //step 3 : if there is no profile pic then find the user by id from the database and update the bio and fullName fields
        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId,{bio,fullName},{new:true}) //new:true means return the new value i.e the updated value not the old one
        }
        else{ //step 3.1 : and if there is a profilepic then we have to 1st upload it in cloudinary and convert the image to url and then update all the fields
            const upload = await cloudinary.uploader.upload(profilePic) //uploading the profile picture to cloudinary and i think this upload contains the url of the profilePic and we can have access of the url by upload.secure_url
            updatedUser = await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true})
        }
        res.json({
            success:true,
            user : updatedUser
        })
        /*  i think erom type ero kichu kora jeto
        user = await User.findById(userId)//finding the user by the id
        user.fullName = fullName;
        user.bio = bio;
        user.profilePic = upload.secure_url;
        validateBeforeSave
        */
    } catch (error) {
        console.log(error.message);
        res.json({
                success:false,
                message : error.message
            })
    }
}


