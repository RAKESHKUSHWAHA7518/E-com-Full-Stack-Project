 const mongoose = require('mongoose');

 const addressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true,
        match: [/^[A-Za-z0-9\-]{3,10}$/, 'Invalid postal code format']
    },
    country: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
 }, { timestamps: true });

 const userSchema= new mongoose.Schema({
    name: String,
    email: {
        type:String,
        unique:true,
        required:true
    },

    password:{
        type:String,

    },

    profilePic:{
        type:String,
    },
    role:String,

    phone: {
        type: String,
        default: ''
    },

    addresses: {
        type: [addressSchema],
        default: [],
        validate: [v => v.length <= 5, 'Maximum 5 addresses allowed']
    }

 },{timestamps:true})


 const userModel = mongoose.model('user',userSchema);

 module.exports =userModel