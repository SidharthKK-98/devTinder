const mongoose=require("mongoose")
const validator=require("validator")

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

module.exports= mongoose.model("User",userSchema)