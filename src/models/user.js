const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const userSchema= new mongoose.Schema({

    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        validate(value){
          if(!validator.isEmail(value))  {
            throw new Error("Invalid email address")
          }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String
    }

},{timestamps:true})

userSchema.methods.getJWT=function(){
    const user=this
    const token=  jwt.sign({_id:user._id},"sid@kk",{expiresIn:"7d"})
    return token

}

userSchema.methods.validatePassword=async function(inputPasswordByUser){
    const user=this
    const hashePassword=user.password
    const isPassworValid=await bcrypt.compare(inputPasswordByUser,hashePassword)
    return isPassworValid

}
module.exports= mongoose.model("User",userSchema)