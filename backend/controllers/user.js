const USER = require("../models/user")
const bcryptjs = require("bcryptjs")
const {cloudinary} = require("../lib/cloudinary")
const { generateToken } = require("../lib/generateToken")

async function signup(req, res) {
    try {
        const { fullName, email, password } = req.body
        if (!fullName) {
            return res.status(400).json({ message: "name is required" })
        }
        if (!email) {
            return res.status(400).json({ message: "email is required" })
        }
        if (!password) {
            return res.status(400).json({ message: "password is required" })
        }

        const user = await USER.findOne({ email })
        if (user) {
            return res.status(401).json({ message: "User already exits" })

        }

        const hashedPassword = await bcryptjs.hash(password, 10)

        const newUser = new USER({
            fullName,
            email,
            password: hashedPassword
        })
        await newUser.save()
        generateToken(newUser._id, res)

        res.status(200).json({ user: { ...newUser._doc, password: undefined }, message: "User signuped successfully" })
    } catch (error) {
        console.log("Error while signingup", error)
        return res.status(500).json({ message: "Internal server error"})
    }
}


async function login(req, res) {
    try {
        const { email, password } = req.body
        if (!email) {
            return res.status(400).json({ message: "email is required" })
        }
        if (!password) {
            return res.status(400).json({ message: "email is password" })
        }

        const user = await USER.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credetails" })
        }
        
        const isPasswordVerified =  await bcryptjs.compare(password,user.password)
        if (!isPasswordVerified) {
            return res.status(400).json({ message: "Invalid credetails" })
        }
        generateToken(user._id, res)
         res.status(200).json({ message: "User is Logined Successfully" })
    } catch (error) {
        console.log("Err in login", error.message)
        return res.status(500).json({ message: "Internal server error"})
    }
}

async function logout(req,res){
    try{
        res.cookie("token","",{
            maxAge : "0d"
        })
        res.status(200).json({message : "User logout succesfully"})

    }catch(error){
        console.log("error while logout",error.message)
        return res.status(500).json({message : "Internal server error"})
    }
} 

async function updateProfile(req,res){
    try{
        const userId = req._id
        const {profilePic} = req.body

        if(!userId){
            return res.status(400).json({message : "User is not authenticated"})
        }

        const uploadedPic = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await USER.findByIdAndUpdate(userId,{profilePic : uploadedPic},{new : true})

        res.status(200).json({message : "Profile pic updated successfully",user : {updatedUser}})
    }catch(error){
        console.log("err while updating pic",err)
        return res.status(500).json({message : "Internal Server error"})
    }
}

async function checkauth(req,res){
    try{
        const user = req.user
        return res.status(200).json({user: user,message : "User authenticated successfully"})
    }catch(error){
         console.log("err while authentication",error.message)
         return res.status(500).json({message : "Internal Server Error"})
    }
}

module.exports = {
    signup,
    login,
    logout,
    updateProfile,
    checkauth
}