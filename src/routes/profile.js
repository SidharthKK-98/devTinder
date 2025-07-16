const express=require("express")

const profileRouter=express.Router()
const {userAuth}=require("../middlewares/auth")
const {validateEditProfile}=require("../utils/validation")
const validator=require("validator")
const bcrypt=require("bcrypt")



profileRouter.get("/profile/view",userAuth,async(req,res)=>{

    try{
        const profile= req.user
        res.send(profile)
        console.log(req.user);
        
         
    }
     catch(err){

    res.status(400).send("something went wrong" + err)
    console.log(err);
    
  }

 
})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
   try{
     const isAllowed=validateEditProfile(req)
    if(!isAllowed){
        res.send("this cant be updated")
        
    }
            // console.log(req.body);
            Object.keys(req.body).forEach((field)=>(
                
                req.user[field]=req.body[field]

            ))
            await req.user.save()
            res.send(req.user)
            

   }
   catch(err){
          res.status(400).send("something went wrong" + err)
          console.log(err); 
   }
     
})

profileRouter.patch("/profile/editPassword",userAuth,async(req,res)=>{
    try{

        const {oldPassword,newPassword}=req.body
        
        isOldPasswordValid=await req.user.validatePassword(oldPassword)

        if(!isOldPasswordValid){
            res.send("wrong Password")
        }
        if(!validator.isStrongPassword(newPassword)){
            res.send("password is not strong")
        }
        const hashedNewPassword=await bcrypt.hash(newPassword,10)
        req.user.password=hashedNewPassword
        await req.user.save() 
        res.status(200).send("Password updated successfully")


    }
    catch(err){
        console.log(err);
        
    }
})


module.exports=profileRouter