const express=require("express")
const requestRouter=express.Router()

const {userAuth}=require("../middlewares/auth")
const connectionRequestModel=require("../models/connectionRequest")
const User=require("../models/user")

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{

    try{

        const fromUserId=req.user._id
        const toUserId=req.params.toUserId
        const status=req.params.status
        const photoUrl=req.user.photoUrl

        const acceptedStatus=["ignore","interested"]
        if(!acceptedStatus.includes(status)){
            return res.status(400).json({message:"invalid status"})
        }
         const toUser= await User.findById(toUserId)
         if(!toUser){
            return res.status(400).send("No such User existing")
         }

        const existingRequest= await connectionRequestModel.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        if(existingRequest){
           return res.status(400).json({message:"connection is already existing"})
        }
        // if(fromUserId==toUserId){
        //     return res.status(400).send("you can not connect to yourself")
        // }


        const connectionRequest=new connectionRequestModel({
            fromUserId,
            toUserId,
            status, 
            photoUrl
            
        })
        const data= await connectionRequest.save() 
        res.send(data) 

    }
    catch(err){
        console.log(err);
        res.status(400).send(err.message)
        
    }

})

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{

        const {status,requestId}=req.params

        const allowedStatus=["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).send("invalid status")
        }

        const connectionRequest=await connectionRequestModel.findOne({
            _id:requestId,
            toUserId:req.user._id,
            status:"interested",

        })
        if(!connectionRequest){
            return res.status(400).send("connection not found")
        }
        connectionRequest.status=status
         const  data= await connectionRequest.save()

         res.status(200).json({
            message:status+"successfully",
            data
         })

    }
    catch(err){
        res.status(400).send(err+" error")
    }
})

module.exports=requestRouter