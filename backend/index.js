const express = require("express")
const authRoutes = require("./routes/auth-route.js")
const dotenv = require("dotenv").config()
const app = express()
const {connectDB} = require("./lib/connection.js")
const PORT = process.env.PORT || 5000

connectDB().then(() => console.log("mongoDB connected")).catch((err) => console.log("mongoDB connection err",err))
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use(express.json())

app.listen(PORT, () => console.log(`server started at PORT no ${PORT}`))