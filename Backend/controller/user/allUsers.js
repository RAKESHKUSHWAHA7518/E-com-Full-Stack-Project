// const userModel = require("../models/usermodel");
const userModel= require('../../models/userModel')
 async function  allUsers(req,res){
    try {
        console.log("userid",req.userId);

        const allUsers =await userModel.find()

        res.json({
            message: ' All user is list  done ',
            success:true,
            error:false,
            data:allUsers
        })
        
    } catch (err) {
        res.json({
            message:err.message ||err,
            error:true,
            success: false,
    })
 }
}

module.exports =allUsers