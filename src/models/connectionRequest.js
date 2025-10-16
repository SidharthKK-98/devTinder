const mongoose=require('mongoose')

const connectionRequestSchema= new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    status:{
        type:String,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        },
        required:true

    },
    photoUrl:{
        type:String,
        
    }
},{timestamps:true})

connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("you can not send request to yourself")
    }
    next()
}) 


module.exports=mongoose.model("connectionRequestModel",connectionRequestSchema)