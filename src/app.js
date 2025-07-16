const express=require('express')
const connectDB=require("./config/database")
const app=express()
const cookie=require('cookie-parser')
const authRoutes=require("../src/routes/auth")
const profileRoutes=require("../src/routes/profile")

app.use(express.json())
app.use(cookie())


app.use("/",authRoutes)
app.use("/",profileRoutes)




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
