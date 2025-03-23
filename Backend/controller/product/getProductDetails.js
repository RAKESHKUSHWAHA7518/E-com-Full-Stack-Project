const productModel= require('../../models/productModel')

const getProductDetails= async(req,res)=>{
    try {
        const {productId}=req.body
        const product = await productModel.findById(productId)
        res.json({
            data: product,
            message: "ok",
            success: true,
            error: false

        })
        
    } catch (err) {
        res.json({
            message: err?.messsage||err,
            error:true,
            success:true
        })
    }
}

module.exports = getProductDetails