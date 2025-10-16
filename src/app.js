const express=require('express')
const connectDB=require("./config/database")
const app=express()
const cors=require("cors")
const cookie=require('cookie-parser')
const authRoutes=require("../src/routes/auth")
const profileRoutes=require("../src/routes/profile")
const connectionRequest = require('../src/routes/request')
const userRouter = require('../src/routes/user')

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true

}
))
app.use(express.json())
app.use(cookie())


app.use("/",authRoutes)
app.use("/",profileRoutes)
app.use("/",connectionRequest)
app.use("/",userRouter)





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
