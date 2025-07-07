const express=require('express')
const connectDB=require("./config/database")
const app=express()
const User=require("./models/user")
const validator=require("validator")
const bcrypt=require("bcrypt")

app.use(express.json())

app.post("/signup",async(req,res)=>{

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

app.post("/login",async(req,res)=>{

    try{
        const{emailId,password}=req.body

    if(!validator.isEmail(emailId)){
        throw new Error("invalid credentials")
    }

    const user=await User.findOne({emailId})

    if(!user){
        throw new Error("no user present")
    }

    const isPassworValid=await bcrypt.compare(password,user.password)
    if(!isPassworValid){
        res.send("invalid credentials")
    }
    else{
        res.status(200).json({
            message:"login successfull",
            user:{
                firstName:user.firstName,
                lastName:user.lastName,
                age:user.age,
                gender:user.gender
            }

        })
    }
    }
    catch(err){

    res.status(400).send("something went wrong" + err)
    console.log(err);
    
  }
})

app.get("/user",async(req,res)=>{
    try{
       const users= await User.findOne({emailId:req.body.emailId})
       if(!users){
        res.send("no user found")
       }
       else{
            res.send(users)

       }
    }
    catch(err){
        res.send("something went wrong")
    }
})

app.get("/feed",async(req,res)=>{
    try{
       const users= await User.find({})
       if(!users){
        res.send("no user found")
       }
       else{
            res.send(users)

       }
    }
    catch(err){
        res.send("something went wrong")
    }
})

app.delete("/user",async(req,res)=>{

    try{

        const userId=req.body.userId
        const users=await User.findByIdAndDelete(userId) 
        res.send("user is deleted successfully")

    }
    catch(err){
        res.send("something went wrong" + err)
    }
})

app.patch("/user",async(req,res)=>{
    
    const data={...req.body}

    delete data.emailId
    const emailId=req.body.emailId

    console.log(data);
    console.log(emailId);

    

    try{

        const ALLOWED_UPDATES=["gender","age","password"]

        const isUpdateAllowed=Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k))

        if(!isUpdateAllowed){
            throw new Error("Update not allowed")
        }

        const updatedUser=await User.findOneAndUpdate({emailId},data,{new:true})
        res.send(updatedUser)

    }
    catch(err){
        res.send("something went wrong"+err)
    }
})

connectDB().then(
    ()=>{
        console.log("database connected successfully");

        app.listen(3000,()=>{
    
        console.log("server start on  port 3000");
    
})
        
    }
)
.catch((err)=>{
    console.log(err +"error");
    
})
