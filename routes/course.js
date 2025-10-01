const express= require("express")
const router= express.Router;
 const {courseModel, purchaseModel} = require("../db");
const { userMiddleware } = require("../middleware/user");
const courseRouter= router()

courseRouter.post("/purchase",userMiddleware, async (req,res)=>{
    const userId= req.userId;
    const courseId= req.body.courseId

    await purchaseModel.create({
        userId,
        courseId
    })

    res.json({
        msg: "You have successfully purchased the course"
    })
})
courseRouter.get("/preview",async (req,res)=>{
    const course= await courseModel.find({})

    res.json({
        course
    })
})

module.exports={
    courseRouter: courseRouter

}