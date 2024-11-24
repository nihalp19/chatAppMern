const jwt = require("jsonwebtoken")
const USER = require("../models/user")
const dotenv = require("dotenv").config()


const VerifyToken = async (req,res,next) => {
   
    try{
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).status({message : "Unauthorized - NO Token Provided"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({message : "Unauthorized - Invalid Token"})
        }

        const user = await USER.findbyId(decoded.userId).select("-password")
        if(!user){
            return res.status(404).json({message : "User not found"})
        }

        req.user = user
        next()
    }catch(err){
        console.log("Error in protection middleware:",err.message)
        return res.status(500).status({message : "Internal Server Error"})

    }
}

module.exports = {
    VerifyToken
}