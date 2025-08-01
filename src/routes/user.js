const express=require("express")
const userRouter=express.Router()
const {userAuth}=require("../middlewares/auth")
const connectionRequestModel=require("../models/connectionRequest")
const user=require("../models/user")
userRouter.get("/user/request/recieved",userAuth,async(req,res)=>{
    try{

        const loggedUser=req.user

        const recievedRequests=await connectionRequestModel.find({
            toUserId:loggedUser,
            status:"interested"
        }).populate("fromUserId","firstName lastName")

        res.status(200).json({
            message: "result",
            recievedRequests
        })

    }
    catch(err){
        res.status(400).send(err)
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{

        const loggedUser=req.user
        const connections=await connectionRequestModel.find({
            $or:[
                {fromUserId:loggedUser,status:"accepted"},
                {toUserId:loggedUser,status:"accepted"}
            ]
        }).populate("fromUserId","firstName lastName").populate("toUserId","firstName lastName")

        const data= connections.map(row=>{
            if(row.fromUserId._id.equals(loggedUser._id) ){
                return row.toUserId
            }
            else{
                return row.fromUserId

            }
        })

        res.status(200).json({
            message:"success",
            data
        })

    }
    catch(err){
        res.status(400).send(err)
    }
})

userRouter.get("/user/feed",userAuth,async(req,res)=>{
    try{

        const loggedInUser=req.user
        const allUsers=await user.find()
        
        const connections= await connectionRequestModel.find({
            $or:[
                {fromUserId:loggedInUser},
                {toUserId:loggedInUser}
            ]
        }).select("fromUserId toUserId")

        const hideUserFromFeed=new Set()
         
        connections.forEach(request=>{
            hideUserFromFeed.add(request.fromUserId.toString())
            hideUserFromFeed.add(request.toUserId.toString())


        })

        const Users=await user.find({
            $and:[
                {_id:{$nin:Array.from(hideUserFromFeed)}},
                {_id:{$ne:loggedInUser}}//if user has no connection till now
            ]
        }).select("firstName lastName")
        console.log(Users);
        

        res.send(Users)
    }
    catch(err){
        res.status(400).send(err.message)
    }
})

module.exports=userRouter