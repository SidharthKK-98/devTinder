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
        type:String,
        enum: {
    values: ["male", "female", "others"],
    message: "{VALUE} is not a valid gender"
  },
    },
     photoUrl: {
        type: String,
        validate(value) {
            if (value && !validator.isURL(value)) {
                throw new Error("Invalid photo URL");
            }
        },
        default:"https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg"
    },
    
    about: {
        type: String,
        maxLength: 500,
        default:"this is about me"
    }
    // skills: {
    //     type: [String], // array of strings
    //     default: []
    // },

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