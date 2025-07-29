const express=require("express")
const userRouter=express.Router()
const {userAuth}=require("../middlewares/auth")
const connectionRequestModel=require("../models/connectionRequest")

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

module.exports=userRouter