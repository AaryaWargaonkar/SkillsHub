const Razorpay = require("razorpay")
const crypto = require("crypto")
const paymentModel = require("../model/paymentModel")
const enrollmentModel = require("../model/enrollmentModel")
const { itemModel } = require("../model/model")

const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

exports.createOrder = async (req,resp) => {
    try {
        const { studentId, courseId } = req.body

        const course = await itemModel.findById(courseId)

        if (!course) {
            return resp.status(404).json({message:"Course not found"})
        }

        const existingEnrollment = await enrollmentModel.findOne({
            studentId,
            courseId
        })

        if (existingEnrollment) {
            return resp.status(400).json({message:"You are already enrolled in this course"})
        }

        if (course.price <= 0) {
            return resp.status(400).json({message:"This is a free course. No payment is required"})
        }

        const options = {
            amount:Math.round(course.price * 100),
            currency:"INR",
            receipt:`receipt_${Date.now()}`
        }

        const order = await razorpay.orders.create(options)

        resp.status(201).json({
            message:"Order created successfully",
            orderId:order.id,
            amount:order.amount,
            currency:order.currency,
            keyId:process.env.RAZORPAY_KEY_ID
        })
    } catch(error) {
        console.log(error)
        resp.status(500).json({message:"Failed to create payment order"})
    }
}

exports.verifyPayment = async (req,resp) => {
    try {
        const {
            studentId,
            courseId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body

        const generatedSignature = crypto
            .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex")

        if (generatedSignature !== razorpay_signature) {
            return resp.status(400).json({
                message:"Payment verification failed"
            })
        }

        const course = await itemModel.findById(courseId)

        if (!course) {
            return resp.status(404).json({
                message:"Course not found"
            })
        }

        const existingEnrollment = await enrollmentModel.findOne({
            studentId,
            courseId
        })

        if (existingEnrollment) {
            return resp.status(400).json({
                message:"You are already enrolled in this course"
            })
        }

        const payment = await paymentModel.create({
            studentId,
            courseId,
            razorpayOrderId:razorpay_order_id,
            razorpayPaymentId:razorpay_payment_id,
            amount:course.price,
            status:"success"
        })

        const enrollment = await enrollmentModel.create({
            studentId,
            courseId
        })

        resp.status(200).json({
            message:"Payment successful. Course enrolled successfully",
            payment,
            enrollment
        })
    } catch(error) {
        console.log(error)
        resp.status(500).json({
            message:"Payment verification failed"
        })
    }
}