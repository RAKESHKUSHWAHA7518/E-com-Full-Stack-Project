const uploadproductPermission = require("../../helpers/permission")
const productModel = require("../../models/productModel")

async  function updateProductController(req,res){
    try {
      
        if(!uploadproductPermission(req.userId)){
            throw new Error("You are not  allowed to premission")
        }

        const  {_id,...resBody}= req.body

        // const  productId= req?._id

        const updateProduct = await productModel.findByIdAndUpdate(_id,resBody)
        res.json({
            message:"Product updated successfully",
            data: updateProduct,
            success:true,
            error:false
        })

        

        
    } catch (err) {
        res.json({
            message:err.message ||err,
            error:true,
            success: false,
        
        })

        
    }
}


module.exports = updateProductController