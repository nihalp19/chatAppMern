import USER from "../models/user-models.js"
import bcryptjs from "bcryptjs"
import generateToken from "../utils/generateToken.js"
export const signup = async (req, res) => {
    try {
        const { fullName, username, password, ConfirmPassword, gender, profilePic } = req.body

        if (!fullName) {
            return res.status(400).json({ success: false, message: "fullname is required" })
        }
        if (!username) {
            return res.status(400).json({ success: false, message: "username is required" })
        }
        if (!password) {
            return res.status(400).json({ success: false, message: "password is required" })
        }
        if (!ConfirmPassword) {
            return res.status(400).json({ success: false, message: "ConfirmPassword is required" })
        }
        if (!gender) {
            return res.status(400).json({ success: false, message: "gender is required" })
        }
        if (password !== ConfirmPassword) {
            return res.status(400).json({ success: false, message: "Password is not matching with confirm-password" })
        }



        const user = await USER.findOne({ username })
        if (user) {
            return res.status(400).json({ success: false, message: "user is already present" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)

        const boyProfilPic = `https://avatar.iran.liara.run/public/boy?username=${username}`

        const girlprofilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new USER({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilPic : girlprofilePic
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
        const { username, password } = req.body
        if (!username) {
            return res.status(400).json({ success: false, message: "username is required" })
        }

        if (!password) {
            return res.status(400).json({ success: false, message: "password is required" })
        }

        const user = await USER.findOne({ username })
        const passCompared = await bcryptjs.compare(password,user.password)

        if (!user || !passCompared) {
            return res.status(400).json({ success: "false", message: "Invalid Credentials" })
        }

        if (user) {
            generateToken(res,user._id)
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
    try{
        res.clearCookie("token")
        return res.status(200).json({success : true,message : "User is logout"})
    }
    catch(error){
        console.log("Error while logout",error.message)
        return res.status(400).json({success : false,message:"Internal Server error",error : error.message})
    }
}