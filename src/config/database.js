const mongoose = require('mongoose')

const connectDB=async()=>{

    await mongoose.connect(
        "mongodb+srv://sidharthkk98:RfsPw4rz2TLZ8eI5@cluster0.pkjaelp.mongodb.net/DevTinder"
    )
}


module.exports=connectDB
