const jwt=require("jsonwebtoken")
const user=require("../models/user")

const userAuth=async(req,res,next)=>{

   try{
     const {token}=req.cookies
    if(!token){
        console.log("invalid token");
        
        res.status(401).send("invalid token")

    }
    const decodedValue= jwt.verify(token,"sid@kk")
    const {_id}= decodedValue
    

    const validUser=await user.findById(_id) 
    if(!validUser){
        throw new Error("User is not found")
    }

    req.user=validUser
    // console.log("validUser",validUser)
    next()
   }
   catch(err){
    console.log("something is wrong"+err);
    return res.status(404).send(err)
   }
    


}

module.exports={userAuth}