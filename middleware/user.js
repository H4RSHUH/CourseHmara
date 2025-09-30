const jwt= require("jsonwebtoken");
const { use } = require("react");
const USER_SECRET= "pikachu"

function userMiddleware(req,res,next){
    const token = req.headers.token
    const decoded= jwt.verify(token, USER_SECRET)

    if(decoded){
        req.id= decoded.id;
        next()
    }
    else{
        res.status(403).json({
            msg:"You are not signed in"
        })
    }
}

module.exports={
    userMiddleware: userMiddleware
}