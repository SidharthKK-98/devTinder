const express=require('express')

const app=express()

app.use((req,res)=>{
    res.send("Hi from Server");
    
})

app.listen(3000,()=>{
    console.log("server start on  port 3000");
    
})