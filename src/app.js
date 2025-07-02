const express=require('express')
const connectDB=require("./config/database")
const app=express()
const User=require("./models/user")

app.post("/signup",async(req,res)=>{

    const user=new User({

        firstName:"Sid",
        lastName:"K K",
        emailId:"sid@gmail.com",
        password:"sid@123",
        age:27,
        gender:"male"
    })

    await user.save()
    res.send("user added successfully")
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
