const bcryptjs = require("bcryptjs")
const USER = require("../models/user")
const { generateToken } = require("../lib/utils")
const {cloudinary} = require("../lib/cloudinary")

async function signup(req, res) {
    const { fullName, email, password } = req.body
    try {
        if (fullName || email || password) {
            return res.status(400).json({ message: "Empty fields" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }
        const user = await USER.findOne({ email })
        if (user) return res.status(400).json({ message: "Email already exits" });

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const newUser = new USER({
            fullName,
            email: email,
            password: hashPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                user: {
                    ...newUser._doc,
                    password: undefined
                }
            })
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }



    } catch (err) {
        console.log("Error in signup controller", err.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}
async function login(req, res) {
    const { email, password } = req.body
    try {
        if (!email) {
            res.status(400).json({ message: "Please enter the email" })
        }
        if (!password) {
            res.status(400).json({ message: "Please enter the Password" })
        }

        const user = await USER.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        ispasswordMatched = await bcryptjs.compare(password, user.password)

        if (!ispasswordMatched) {
            return res.status(400).json({ message: "Invalid credentails" })
        }

        generateToken(user._id, res)

        res.status(200).json({
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (err) {
        console.log("Error in login controller",err.message)
        res.status(500).json({message : "Internal Server Error"})
    }
}
async function logout(req, res) {
    try{
        res.cookie("jwt","",{maxAge : 0})
        res.status(200).json({message : "Logged out successfully"})
    }catch(error){
        console.log("Error in logout controllet",error.message)
        res.status(500).json({message : "Internal Server Error"})
    }
}

async function updateProfile(req,res){
    try{
        const {profilePic} = req.body
        const userId = req.user._id

        if(!profilePic){
            return res.status(400).json({message : "Profile pic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await USER.findByIdAndUpdate(userId,{profilePic : uploadResponse.secure_url})
    }catch(err){
        console.log("error in update profile",error)
        res.status(500).json({message : "Internal server error"})
    }
}

async function checkauth(req,res){
    try{
        res.status(200).json(req.user);
    }catch(err){
        console.log("Error in checkAuth controller",error.message)
        res.status(500).json({message : "Interna Server Error"})
    }
}

module.exports = {
    signup,
    login,
    logout,
    updateProfile,
    checkauth
}