const express=require("express")

const authRoutes= express.Router()
const User=require("../models/user")
const bcrypt=require("bcrypt")
const validator=require("validator")



authRoutes.post("/signup",async(req,res)=>{

  try{
    const {firstName,lastName,emailId,password,age,gender}=req.body
    const encryptedPassword=await bcrypt.hash(password,10)
    console.log(encryptedPassword);
    
      const user=new User({
        firstName,
        lastName,
        emailId,
        password:encryptedPassword,
        age,
        gender
      })
    
    await user.save()
    res.send("user added successfully")
  }
  catch(err){

    res.status(400).send("something went wrong" + err)
    console.log(err);
    
  }
})

authRoutes.post("/login",async(req,res)=>{

    try{
        const{emailId,password}=req.body
        
        

    if(!validator.isEmail(emailId)){
        throw new Error("invalid credentials")
    }

    const user=await User.findOne({emailId})

    if(!user){
        throw new Error("no user present")
    }

    const isPassworValid=await user.validatePassword(password)

    if(!isPassworValid){
        res.send("invalid credentials")
    }
    else{
        const token=  user.getJWT() 
        
        res.cookie("token",token)

        res.status(200).json({
            message:"login successfull"
            
        })
    }
    }
    catch(err){

    res.status(400).send("something went wrong" + err)
    console.log(err);
    
  }
})

authRoutes.post("/logout",(req,res)=>{

  res.clearCookie("token")
  res.status(200).send("loggedout successfully")
})

module.exports=authRoutes