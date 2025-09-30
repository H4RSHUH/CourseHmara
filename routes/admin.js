const { Router }= require("express");
const bcrypt=require("bcrypt")
const adminRouter= Router();
 const {adminModel, courseModel} = require("../db")
const {adminMiddleware}= require("../middleware/admin")
 const jwt= require("jsonwebtoken")
 const ADMIN_SECRET= "MaiAdminHU"
const {z}= require("zod");
const admin = require("../middleware/admin");
const mongoose= require("mongoose")

adminRouter.post("/signup",async (req,res)=>{
    const requiredData=z.object({
        email: z.string().email(),
        password: z.string(),
        firstName: z.string(),
        lastName: z.string()
    })

    let parsedData= requiredData.safeParse(req.body);

    if(!parsedData.success){
        res.json({
            msg: "Invalid Data",
            error: parsedData.error.format()
        })
        return 
    }


    const {email, password, firstName, lastName}= req.body
    let adminExist = false
    try{
        const hashedPass= await bcrypt.hash(password,5)

        await adminModel.create({
            email,
            password: hashedPass,
            firstName,
            lastName
        })

    }
    catch(e){
        res.json({
            msg: "admin Already Exists",
        })
        adminExist=true;
    }

    if(!adminExist){
        res.json({
            msg: "Your account has been created"
        })
    }
})
adminRouter.post("/login",async (req,res)=>{
    const {email, password} = req.body;
    const admin = await adminModel.findOne({
        email: email
    })

    const passMatch = await bcrypt.compare(password,admin.password)

    if(passMatch){
        const token = jwt.sign({
            id: admin._id
        }, ADMIN_SECRET)

        res.json({
            token: token
        })
    }
    else{
        res.status(403).json({
            msg: "Incorrect credentials"
        })
    }
})
adminRouter.post("/course",adminMiddleware, async (req,res)=>{
    const adminId= req.id

    const {title, description,price, imageUrl}= req.body
    const course= await courseModel.create({
        title,
        description,
        price,
        imageUrl,
        creatorId: adminId
    })

    res.json({
        msg: "Course has been created",
        courseid: course._id
    })
})
adminRouter.put("/course", adminMiddleware,async (req,res)=>{
    try {
        const adminId= req.id
    
        const {title, description,price, imageUrl, courseId}= req.body
        const courses= await courseModel.updateOne({
            _id: courseId,
            creatorId: adminId
        },{
            title: title,
            description: description,
            price: price,
            imageUrl: imageUrl,
        })
    
        res.json({
            msg: "Course has been Updated",
            courseid: courses._id
        })
    } catch (error) {
        res.json({
            msg: "It is not your course"
        })
    }
})


adminRouter.get("/course",adminMiddleware,async (req,res)=>{
    const adminId= req.id

    const course= await courseModel.findOne({
        creatorId: adminId
    })

    res.json({
        msg: "Course has been created",
        course
    })
})

module.exports={
    adminRouter: adminRouter
}