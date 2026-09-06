const mongoose= require('mongoose')

const itemSchema=mongoose.Schema({
    ID:{
        type:Number,
        required:true
    },
    courseName:{
        type:String,
        required:true
    },
    instructor:{
        type:String,
        required:true
    },
    instructorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"skillhub",
        required:true
    },
    category:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    level:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        default:0
    }
})

const itemModel=mongoose.model("test",itemSchema)

module.exports={itemModel}