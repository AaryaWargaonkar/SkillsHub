const express = require("express")
const { createOrder, verifyPayment } = require("../controller/paymentController")

const paymentRouter = express.Router()

paymentRouter.post("/create-order", createOrder)
paymentRouter.post("/verify", verifyPayment)

module.exports = paymentRouter