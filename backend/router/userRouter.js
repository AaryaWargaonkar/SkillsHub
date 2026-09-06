
const express = require("express")
const { register, login, updateProfile } = require("../controller/userController")

const userRouter = express.Router()

userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.put("/update-profile/:id", updateProfile)

module.exports = userRouter