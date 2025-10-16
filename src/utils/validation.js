
const validateEditProfile=(req)=>{

    const allowedEditFields=["firstName","lastName","emailId","age","gender","photoUrl","about"]

    const isAllowed=Object.keys(req.body).every((key)=>allowedEditFields.includes(key))

    return isAllowed

}

module.exports={validateEditProfile}