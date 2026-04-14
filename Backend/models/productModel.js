 const mongoose = require('mongoose');

 const productSchema = mongoose.Schema({
    productName: String,
    brandName: String,
    category: String,
    productImage:[],
    description: String,
    price:Number,
    sellingPrice: Number,
    // Review aggregates
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:   { type: Number, default: 0, min: 0 },
    ratingBreakdown: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
 },{
    timestamps:true
})

const productModel = mongoose.model('Product',productSchema);

module.exports = productModel