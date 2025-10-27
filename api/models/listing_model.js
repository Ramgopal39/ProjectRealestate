import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    contactNumber:{
        type:String,
        required:true,
        match: [/^\d{10}$/, 'Contact number must be exactly 10 digits']
    },
    regularPrice:{
        type:Number,
        required:true
    },
    discountPrice:{
        type:Number,
        required:true
    },
    bedrooms:{
        type:Number,
        required:true
    },
    bathrooms:{
        type:Number,
        required:true
    },
    furnished:{
        type:Boolean,
        required:true
    },
    parking:{
        type:Boolean,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    offer:{
        type:Boolean,
        required:true
    },
    imageUrls:{
        type:Array,
        required:true,
        validate: [
          function(arr){ return Array.isArray(arr) && arr.length >= 2; },
          'At least 2 images are required'
        ]
    },
    userRef:{
        type:String,
        required:true
    }
}, {
    timestamps:true
});

const listing = mongoose.model("Listing", listingSchema);

export default listing ;