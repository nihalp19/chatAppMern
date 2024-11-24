const express = require("express")
const { signup, login, logout,updateProfile,checkauth } = require("../controllers/auth-controllers")
const VerifyToken  = require("../middleware/VerifyToken")

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.put("/upadate-profile", VerifyToken, updateProfile)
router.get("/checkauth", VerifyToken, checkauth)

module.exports = router
