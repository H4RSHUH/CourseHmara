const jwt= require("jsonwebtoken")
const ADMIN_SECRET= "MaiAdminHU"

function adminMiddleware(req,res,next){
    const token = req.headers.token
    const decoded= jwt.verify(token, ADMIN_SECRET)

    if(decoded){
        req.id= decoded.id;
        next()
    }
    else{
        res.status(403).json({
            msg:"You are not signed in.."
        })
    }
}

module.exports={
    adminMiddleware: adminMiddleware
}