const express=require("express")
const { userAuth } = require("../middlewares/auth")
const paymentRoutes=express.Router()
const RazoprpayInstance=require("../utils/razorpay")
const Payment= require("../models/payments")
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

        const webhookSignature=req.headers("X-Razorpay-Signature")

        const isWebhookValid=validateWebhookSignature(JSON.stringify(webhookBody), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET)

        if(!isWebhookValid){
            res.status(400).json({message:"webhook is not valid"})
        }
        console.log(req.body)

    }
    catch(err){
        console.log(err);
        
    }

})


module.exports=paymentRoutes
