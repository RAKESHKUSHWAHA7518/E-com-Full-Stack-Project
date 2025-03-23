const productModel = require("../../models/productModel")
 

const getCategoryProduct= async(req,res)=>{
    try {
        const productCategory =await productModel.distinct("category") 
        console.log("Product",productCategory);
        const productByCategory = []
        for(const category of productCategory){
            const product=await productModel.findOne({category:category})
            if(product){
               productByCategory.push(product) 
            }
        }
        res.json({
            message:"category product",
            data:productByCategory,
            success:true,
            error:false

        })
    } catch (error) {
        console.log(error);
        
        res.status(400).json({
            message:error.message ||error,
            error:true,
            success: false,
        
        })
        
    }
}

module.exports = getCategoryProduct