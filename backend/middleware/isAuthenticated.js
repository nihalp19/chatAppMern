const jwt = require("jsonwebtoken")
const dotenv = require("dotenv").config()
const USER = require("../models/user")

async function isAuthenticated(req, res, next) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(400).json({ message: "Token is required" })
        }

        const decoded = jwt.verify(token, process.env.SECERET_KEY)
        if (!decoded) {
            return res.status(400).json({ message: "error while decoding the token" })
        }

        const userId = decoded.userId
        

        const user = await USER.findOne({ _id: userId }).select("-password")
        if (!user) {
            return res.status(400).json({ message: "user is not authenticated" })
        }
        req.user = user
        next()
    } catch (error) {
        console.log("Error in authentication", error.message)
        return res.status(500).json({ message: "Internal Server error" })
    }
}

module.exports = {
    isAuthenticated
}