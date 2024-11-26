const jwt = require("jsonwebtoken")

function generateToken(userId, res) {
    try {
        if (!userId) {
            return res.status(400).status({ message: "USER ID IS NOT their" })
        }

        const token = jwt.sign({ userId }, process.env.SECERET_KEY)
        if (!token) {
            return res.status(400).status({ message: "token is not signed" })
        }

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
        })
        return token
    } catch (error) {
        console.log("Error while generating token", error)
        return res.status(400).json({ message: error.message })
    }
}

module.exports = {
    generateToken
}