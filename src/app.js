const express=require('express')
const connectDB=require("./config/database")
const app=express()
const User=require("./models/user")

app.use(express.json())

app.post("/signup",async(req,res)=>{

  try{
      const user=new User(req.body)
    console.log(user._id);
    
    await user.save()
    res.send("user added successfully")
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
    console.log(req.body);
    
    const emailId=req.body.emailId
    const data=req.body

    try{

        const updatedUser=await User.findOneAndUpdate({emailId},data,{new:true})
        res.send(updatedUser)

    }
    catch(err){
        res.send("something went wrong")
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
