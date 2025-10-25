const express=require("express")

const authRoutes= express.Router()
const User=require("../models/user")
const bcrypt=require("bcrypt")
const validator=require("validator")



authRoutes.post("/signup",async(req,res)=>{

  try{
    const {firstName,lastName,emailId,password,age,gender,photourl,skills,about}=req.body
    const encryptedPassword=await bcrypt.hash(password,10)
    // console.log(encryptedPassword);

    const existingUser=await User.findOne({emailId})
    if(existingUser){
      return res.status(400).json({message:"user is already existing"})
    }
    
      const user=new User({
        firstName,
        lastName,
        emailId,
        password:encryptedPassword,
        age,
        gender,
        photourl,
        skills,
        about

      })
    
    const savedUser=await user.save()
    // res.json({message:"user added successfully",data:savedUser})

    const token=  savedUser.getJWT() 
        
        res.cookie("token",token,{
          httpOnly: true,
          sameSite:"none",
          secure: true
        })

        res.status(200).json({
            message:"signup successfull",
            user:savedUser
            
        })
  }
  catch(err){

    res.status(400).send("something went wrong" + err.message)
    console.log(err);
    
  }
})

authRoutes.post("/login",async(req,res)=>{

    try{
        const{emailId,password}=req.body
        
        

    if(!validator.isEmail(emailId)){
        // throw new Error("invalid credentials")
        return res.status(400).json({error:"invalid credentials"})

    }
 
    const user=await User.findOne({emailId})

    if(!user){
        return res.status(400).json({error:"no user present"})

        // throw new Error("no user present")
    }

    const isPassworValid=await user.validatePassword(password)

    if(!isPassworValid){
        return res.status(400).json({error:"invalid credentials"})
    }
    else{
        const token=  user.getJWT() 
        
        res.cookie("token",token,{
          httpOnly: true,
          sameSite:"none",
          secure: true
        })

        res.status(200).json({
            message:"login successfull",
            user
            
        })
    }
    }
    catch(err){

    res.status(400).json("something went wrong" + err)
    console.log(err);
    
  }
})

authRoutes.post("/logout",(req,res)=>{

  res.clearCookie("token")
  res.status(200).send("loggedout successfully")
})

module.exports=authRoutes 