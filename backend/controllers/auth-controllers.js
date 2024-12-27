import USER from "../models/user-models.js"
import bcryptjs from "bcryptjs"
import generateToken from "../utils/generateToken.js"
import cloudnairy from "../lib/cloudnairy.js"
export const signup = async (req, res) => {
    try {
        const { fullName, email, password, } = req.body

        if (!fullName) {
            return res.status(400).json({ success: false, message: "fullname is required" })
        }
        if (!email) {
            return res.status(400).json({ success: false, message: "email is required" })
        }
        if (!password) {
            return res.status(400).json({ success: false, message: "password is required" })
        }



        const user = await USER.findOne({ email })
        if (user) {
            return res.status(400).json({ success: false, message: "user is already present" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)

        const newUser = new USER({
            fullName,
            email,
            password: hashedPassword,
        })
        await newUser.save()

        generateToken(res, newUser._id)

        return res.status(201).json({
            success: true, message: "User is registered successfully", user: {
                ...newUser._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log("Error while creating user", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email) {
            return res.status(400).json({ success: false, message: "email is required" })
        }

        if (!password) {
            return res.status(400).json({ success: false, message: "password is required" })
        }

        const user = await USER.findOne({ email })
        const passCompared = await bcryptjs.compare(password, user.password)

        if (!user || !passCompared) {
            return res.status(400).json({ success: "false", message: "Invalid Credentials" })
        }

        if (user) {
            generateToken(res, user._id)
            return res.status(200).json({
                success: true, message: "User is login SuccessFully", user: {
                    ...user._doc,
                    password: undefined
                }
            })
        }
    } catch (error) {
        console.log("Error while login", error.message)
        return res.status(500).json({ success: false, message: "Interval Server Error", error: error.message })
    }
}
export const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ success: true, message: "User is logout" })
    }
    catch (error) {
        console.log("Error while logout", error.message)
        return res.status(400).json({ success: false, message: "Internal Server error", error: error.message })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body
        const userId = req.user._id

        if (!profilePic) {
            console.log("hello")
            return res.status(400).json({ success: false, message: "Profile pic is required" })
        }

        const uploadresponse = await cloudnairy.uploader.upload(profilePic)
        const updatedUser = await USER.findByIdAndUpdate(userId, { profilePic: uploadresponse.secure_url }, { new: true })
        res.status(200).json({success : true,message : "Updated SuccessFully",user : updatedUser})
    } catch (error) {
        console.log("update profile :", error)
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

export const checkAuth = (req, res) => {
    try {
        const user = req.user
        res.status(200).json({
            success: true, message: "user is authenticated", user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log("Error is CheckAuth controller", error.message)
        res.stat
    }
}