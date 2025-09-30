const express= require("express")
const router= express.Router;
 const {courseModel} = require("../db")
const courseRouter= router()

courseRouter.post("/purchase", (req,res)=>{

})
courseRouter.get("/preview", (req,res)=>{

})

module.exports={
    courseRouter: courseRouter

}