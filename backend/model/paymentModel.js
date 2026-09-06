const mongoose = require("mongoose")

const paymentSchema = mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"skillhub",
        required:true
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"test",
        required:true
    },
    razorpayOrderId:{
        type:String,
        required:true
    },
    razorpayPaymentId:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["success","failed"],
        default:"success"
    }
},{timestamps:true})

const paymentModel = mongoose.model("payment",paymentSchema)

module.exports = paymentModel