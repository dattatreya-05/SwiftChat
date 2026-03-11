import mongoose from "mongoose";

//Function to connect to the mongoDB database
export const connectDB = async() => {
    try {
        mongoose.connection.on('connected',() => console.log("database connected"))//connection hole ei lekhata asbe
        await mongoose.connect(`${process.env.MONGODB_URI}`) //this is how we are connecting the mongoDB database with our project
    } catch (error) {
        console.log("database connected and the error is "+error)
    }
}