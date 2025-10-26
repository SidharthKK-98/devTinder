const express=require("express")
const { userAuth } = require("../middlewares/auth")
const paymentRoutes=express.Router()
const RazoprpayInstance=require("../utils/razorpay")
const Payment= require("../models/payments")
const User= require("../models/user")

const { membershipAmount } = require("../utils/constants")
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')





paymentRoutes.post("/payment/create",userAuth,async(req,res)=>{

    try{

        const{membershipType}=req.body
        const{firstName,lastName}=req.user

       const order= await RazoprpayInstance.orders.create({
             amount: membershipAmount[membershipType]*100, 
             currency: "INR",
             receipt: "order_rcptid_11",
             notes:{
                firstName,
                lastName,
                membershipType
             }
        })

        console.log(order)
        const payment = new Payment({
            userId:req.user._id,
            orderId:order.id ,
            status:order.status,
            amount:order.amount,
            currency:order.currency,
            receipt:order.receipt,
            notes:order.notes
        })
       const savedPayment= await payment.save()

        res.json({key:process.env.RAZORPAY_ID,...savedPayment.toJSON()})

    }
    catch(err){
        res.json({message:"error occured",data:err.message})
    }
})

paymentRoutes.post("/payment/webhook",async(req,res)=>{


    try{

        const webhookSignature=req.headers["x-razorpay-signature"]

        const isWebhookValid=validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET)

        if(!isWebhookValid){
            console.log("webhook is not valid")
            return res.status(400).json({message:"webhook is not valid"})
        }

        const paymentDetails=req.body.payload.payment.entity

        const payment=await Payment.findOne({orderId:paymentDetails.order_id})
        payment.status=paymentDetails.status
        await payment.save()

        const user=await User.findOne({_id:payment.userId})

        if(user && paymentDetails.status==="captured"){
        user.isPremium=true
        user.membershipType=payment.notes.membershipType
        await user.save()
        }

        


        return res.status(200).json({msg:"webhook recieved"})

    }
    catch(err){
        console.log(err);
        
    }

})

paymentRoutes.get("/premium/verify",userAuth,async(req,res)=>{

    const user=req.user
    if(user.isPremium){ 
        return res.json({isPremium:true})
    }
    return res.json({isPremium:false})


})


module.exports=paymentRoutes
