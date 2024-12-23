import jwt from "jsonwebtoken"

const generateToken = (res, id) => {
    try {
        const token = jwt.sign({ id }, process.env.JWT_SECERET_TOKEN,{
            expiresIn : "7d"
        })
        res.cookie("token", token, {
            maxAge: 24 * 7 * 60 * 60 * 1000, 
            httpOnly: true,                
            secure: process.env.NODE_ENV !== "development", 
            sameSite: "strict",
        })
    }
    catch (error) {
        console.log("Error while generating token", error.message)
    }
}

export default generateToken