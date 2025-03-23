 const mongoose = require('mongoose');

 const productSchema = mongoose.Schema({
    productName: String,
    brandName: String,
    category: String,
    productImage:[],
    description: String,
    price:Number,
    sellingPrice: Number,
 },{
    timestamps:true
})

const productModel = mongoose.model('Product',productSchema);

module.exports = productModel