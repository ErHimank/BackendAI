const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({    // this is model schema 
    name : {
        type: String,
        required : true
    },
    description:{
        type: String,
        required : true

    },
    richdescription :{
        type: String,
        default : ''
    },
    image :{
       type:  String,
       default: ''
    },
    images : [{
        type:String
    }],
    brand :{
        type:  String,
        default: ''
     },
     price :{
        type : Number,
        default : 0
     },
     category :{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required : true
     },

    countinstock : {
        type : Number,
        required : true,
         min : 0 ,
        max : 255
    },
    rating : { 
        type : Number,
        default : 0
    },
    numreviews : { 
        type : Number,
        default : 0
    },
    isfeatured : { 
        type : Boolean,
        default : false
    },
    datecreated : { 
        type : Date,
        default : Date.now
    },
})

ProductSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ProductSchema.set('toJSON' , {
    virtuals : true,
});

exports.Product = mongoose.model('Product',ProductSchema); //model 
exports.ProductSchema = ProductSchema;