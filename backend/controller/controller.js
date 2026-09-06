const { itemModel } = require("../model/model")
const enrollmentModel = require("../model/enrollmentModel")
const reviewModel = require("../model/reviewModel")

exports.addData=async(req,resp)=>{
    try {
        const newdata=new itemModel(req.body)
        const result=await newdata.save()
        resp.status(200).json(result)
    } catch (error) {
        console.log(error)
        resp.status(500).json({message:"Failed to add course"})
    }
}

exports.displayData=async(req,resp)=>{
    try {
        const { instructorId }=req.query
        const data=await itemModel.find()

        const courses=await Promise.all(
            data.map(async(item)=>{
                const studentCount=await enrollmentModel.countDocuments({courseId:item._id})

                const reviews=await reviewModel.find({courseId:item._id})
                const totalReviews=reviews.length

                const averageRating=totalReviews===0
                    ? 0
                    : Number((reviews.reduce((sum,review)=>sum+review.rating,0)/totalReviews).toFixed(1))

                return {
                    ...item.toObject(),
                    studentCount,
                    totalReviews,
                    averageRating,
                    isOwner:instructorId
                        ? String(item.instructorId)===String(instructorId)
                        : false
                }
            })
        )

        resp.status(200).json(courses)
    } catch(error) {
        console.log(error)
        resp.status(500).json({message:"Failed to fetch courses"})
    }
}
exports.getMyCourses=async(req,resp)=>{
    try {
        const { instructorId }=req.params
        const data=await itemModel.find({instructorId})

        const courses=await Promise.all(
            data.map(async(item)=>{
                const studentCount=await enrollmentModel.countDocuments({courseId:item._id})
                const reviews=await reviewModel.find({courseId:item._id})
                const totalReviews=reviews.length
                const averageRating=totalReviews===0
                    ? 0
                    : Number((reviews.reduce((sum,review)=>sum+review.rating,0)/totalReviews).toFixed(1))

                return {
                    ...item.toObject(),
                    studentCount,
                    totalReviews,
                    averageRating
                }
            })
        )

        resp.status(200).json(courses)
    } catch(error) {
        console.log(error)
        resp.status(500).json({message:"Failed to fetch your courses"})
    }
}
exports.showData=async(req,resp)=>{
    try {
        const data=await itemModel.findById(req.params.id)

        if(data!=null){
            resp.status(200).json(data)
        }else{
            resp.status(404).json({message:"Course not found"})
        }
    } catch(error) {
        console.log(error)
        resp.status(500).json({message:"Failed to fetch course"})
    }
}

exports.updateData=async(req,resp)=>{
    try {
        const { instructorId }=req.body

        const data=await itemModel.findOneAndUpdate(
            {
                _id:req.params.id,
                instructorId
            },
            req.body,
            {new:true}
        )

        if(data!=null){
            resp.status(200).json({message:"updated"})
        }else{
            resp.status(403).json({message:"You can only update your own courses"})
        }
    } catch(error) {
        console.log(error)
        resp.status(500).json({message:"Failed to update course"})
    }
}

exports.deleteData=async(req,resp)=>{
    try {
        const { instructorId }=req.query

        const data=await itemModel.findOneAndDelete({
            _id:req.params.id,
            instructorId
        })

        if(data!=null){
            resp.status(200).json({message:"deleted"})
        }else{
            resp.status(403).json({message:"You can only delete your own courses"})
        }
    } catch(error) {
        console.log(error)
        resp.status(500).json({message:"Failed to delete course"})
    }
}

exports.showInstructorData=async(req,resp)=>{
    try {
        const { instructorId }=req.query

        const data=await itemModel.findOne({
            _id:req.params.id,
            instructorId
        })

        if(data!=null){
            resp.status(200).json(data)
        }else{
            resp.status(403).json({message:"You can only view your own courses"})
        }
    } catch(error) {
        console.log(error)
        resp.status(500).json({message:"Failed to fetch course"})
    }
}