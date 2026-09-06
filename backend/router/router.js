const express= require('express')
const { addData, displayData, showData, showInstructorData, updateData, deleteData, getMyCourses } = require('../controller/controller')
const router= express.Router()

router.post("/add",addData)
router.get("/display",displayData)
router.get("/my-courses/:instructorId",getMyCourses)
router.get("/show/:id",showData)
router.get("/instructor-show/:id",showInstructorData)
router.put("/update/:id",updateData)
router.delete("/delete/:id",deleteData)

module.exports=router