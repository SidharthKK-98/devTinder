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
        })
        const data= await connectionRequest.save()
        res.send(data) 

    }
    catch(err){
        console.log(err);
        res.status(400).send(err.message)
        
    }

})

module.exports=requestRouter