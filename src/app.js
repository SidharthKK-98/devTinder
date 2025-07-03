const express=require('express')
const connectDB=require("./config/database")
const app=express()
const User=require("./models/user")

app.use(express.json())

app.post("/signup",async(req,res)=>{

  try{
      const user=new User(req.body)

    await user.save()
    res.send("user added successfully")
  }
  catch(err){

    res.status(400).send("something went wrong")
    console.log(err);
    
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
