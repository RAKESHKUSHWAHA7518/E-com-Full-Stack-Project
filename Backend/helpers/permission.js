const userModel = require("../models/userModel")

 const  uploadproductPermission= async(userId)=>{
    const user= await userModel.findById(userId)

    if(user.role!=="ADMIN"){
        return false
    } 
    return false

 }

 module.exports = uploadproductPermission