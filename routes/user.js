const express= require("express")
const router= express.Router;
 const {userModel, courseModel, purchaseModel} = require("../db")
const userRouter= router()
const jwt= require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { z }= require("zod")// for input validation
const USER_SECRET="pikachu"

const {userMiddleware}= require("../middleware/user")

userRouter.post("/signup",async (req,res)=>{
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
    let userExist = false
    try{
        const hashedPass= await bcrypt.hash(password,5)

        await userModel.create({
            email,
            password: hashedPass,
            firstName,
            lastName
        })

    }
    catch(e){
        res.json({
            msg: "User Already Exists",
        })
        userExist=true;
    }

    if(!userExist){
        res.json({
            msg: "Your account has been created"
        })
    }
})
userRouter.post("/login",async (req,res)=>{
    const {email, password} = req.body;
    const user = await userModel.findOne({
        email: email
    })

    const passMatch = await bcrypt.compare(password,user.password)

    if(passMatch){
        const token = jwt.sign({
            id: user._id.toString()
        }, USER_SECRET)

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
userRouter.get("/purchases",userMiddleware,async (req,res)=>{

    const userId= req.userId
    const purchase = await purchaseModel.find({
        userId
    })

    const course= await courseModel.find({
        _id: { $in: purchase.map(x=>x.courseId) }
    })
res.json({
        purchase,
        course
    })
})

module.exports={
    userRouter: userRouter
}