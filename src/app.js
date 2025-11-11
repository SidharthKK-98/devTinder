const express=require('express')
require('dotenv').config()
const connectDB=require("./config/database")
const app=express()
const cors=require("cors")
const cookie=require('cookie-parser')
const authRoutes=require("../src/routes/auth")
const profileRoutes=require("../src/routes/profile")
const connectionRequest = require('../src/routes/request')
const userRouter = require('../src/routes/user')
const paymentRoutes = require('./routes/payment')
const http=require("http")
const initializeSocket = require('./utils/socket')
const chatRoutes = require('./routes/chat')

const server=http.createServer(app)
initializeSocket(server)

app.use(cors({
    origin:["http://localhost:5173","https://dev-tinder-frontend-gray.vercel.app"],
    credentials:true

}
))
app.use(express.json())
app.use(cookie())



app.use("/",authRoutes)
app.use("/",profileRoutes)
app.use("/",connectionRequest)
app.use("/",userRouter)
app.use("/",paymentRoutes)
app.use("/",chatRoutes)







connectDB().then(
    ()=>{
        console.log("database connected successfully");
        const PORT = process.env.PORT || 3001;

        server.listen(PORT,()=>{
    
        console.log(`server start on  port ${PORT}`);
    
})
        
    }
)
.catch((err)=>{
    console.log(err +"error");
    
})
