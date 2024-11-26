const express = require("express")
const dotenv = require("dotenv").config()
const userRoute = require("./routes/auth-users")
const cookieParser = require("cookie-parser")
const { connectDB } = require("./lib/connectDB")

const PORT = process.env.PORT || 5000
const app = express()
connectDB().then(() => console.log("mongoDB Connected")).catch((err) => console.log("MONGODB ERR", err))
app.use(express.json())
app.use(cookieParser())
app.use("/users", userRoute)

app.listen(PORT, () => console.log(`SERVER STARTED AT THE PORT NO ${PORT}`))