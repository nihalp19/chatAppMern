const express = require("express")
const {isAuthenticated} = require("../middleware/isAuthenticated")
const {signup,login,logout,updateProfile,checkauth} = require("../controllers/user")
const router = express.Router()

router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)
router.post('/updatepic',isAuthenticated,updateProfile)
router.get("/checkauth",isAuthenticated,checkauth)

module.exports = router