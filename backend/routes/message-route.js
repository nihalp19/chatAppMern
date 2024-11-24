const express = require("express")
const {getUsersForSideBar,getMessages,sendMessages} = require("../controllers/messages-controllers")
const {VerifyToken}= require("../middleware/VerifyToken")

const router = express.Router()

router.get("/users",VerifyToken,getUsersForSideBar)
router.get("/:id",VerifyToken,getMessages)
router.post("/sender/:id",VerifyToken,sendMessages)




module.exports = router