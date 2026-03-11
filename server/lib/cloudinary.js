import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

export default cloudinary

//we will upload images to cloudinary and cloudinary will get us the url of the images