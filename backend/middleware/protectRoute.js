import jwt from "jsonwebtoken"
import USER from "../models/user-models"

export async function protectRoute(req,res,next){
    try{
        const token = req.cookies.token
        if(!token){
            return res.status(400).json({success : false,message : "User is not authenicated"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECERET_TOKEN)
        if(!decoded){
            return res.status(400).json({success : false,message : "Token is expired or invalid"})
        }

        const user = await USER.findById(decoded.userId)
        if(!user){
            return res.status(400).json({success : false,message : "User is not found"})
        }
        req.user = user
        next()
    }catch(error){
        console.log("Error ",error.message)
        return res.status(500).json({message : false,message : "Internal Server Error",error: error.message})
    }
}