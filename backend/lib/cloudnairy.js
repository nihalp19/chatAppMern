import {v2 as cloudnairy} from "cloudinary"
import dotenv from "dotenv"
dotenv.config()

cloudnairy.config({
    cloud_name : process.env.CLOUDNAIRY_CLOUD_NAME,
    api_key : process.env.CLOUDNAIRY_API_KEY,
    api_secret : process.env.CLOUDNAIRY_API_SECRET
})

export default cloudnairy