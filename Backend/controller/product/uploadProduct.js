const uploadproductPermission = require("../../helpers/permission");
const productModel = require("../../models/productModel")

async function uploadProductController (req, res) {
    try {

        const  sessionUserId = req.userId

        if(!uploadproductPermission(sessionUserId)){
            throw new Error("You are not  allowed to premission")
        }

        const uploadProduct = new productModel(req.body)
        const saveProduct = await uploadProduct.save();
        res.status(201).json({
            success:true,
            message: "Product uploaded successfully",

            error: false,
            // success: true,
            data: saveProduct



        })
        
    } catch (err) {
        res.status(400).json({
            message:err.message ||err,
            error:true,
            success: false,
        
        })
        
    }

}

module.exports = uploadProductController
