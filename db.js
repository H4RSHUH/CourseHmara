const mongoose= require("mongoose")
const Schema= mongoose.mongoose.Schema
const ObjectId= Schema.ObjectId;

mongoose.connect(process.env.MONGO_URL)
const user= new Schema({
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String
})

const course= new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
})

const admin= new Schema({
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String
})

const purchase= new Schema({
    courseId: ObjectId,
    userId: ObjectId
})

const userModel= mongoose.model("user", user)
const courseModel= mongoose.model("course", course)
const adminModel= mongoose.model("admin", admin)
const purchaseModel= mongoose.model("purchase", purchase)

module.exports={
    userModel,
    courseModel,
    adminModel,
    purchaseModel
}