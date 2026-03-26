const mongoose =require('mongoose');

const productSchema =new mongoose.Schema({
  name:{
    type:String,
    required:[true, 'Product name is required'],
    trim:true,
    index:true
  },
  slug:{
    type:String,
    required:[true ,'Slug is required'],
    unique:true,
    lowercase:true,
    trim:true,
    index:true
  },
  description:{
    type:String,
    required:[true,'Description is required'],
    trim:true
  },
  price:{
    type:Number,
    required:[true, 'Price is required'],
    min:[0,'Price cannot be negative'],
    default:0
  },
  priceAfterDiscount:{
    type:Number,
    min:[0,'Price after discount cannot be negative'],
    validate:{
      validator:function(value){
        return value < this.price;
      },
      message:'Price after discount must be less than the original price'
      //should use create() or save() or runValidators:true , context:query if i use update() or findOneAndUpdate()
    }
  },
  stock_quantity:{
    type:Number,
    required:[true, 'Stock quantity is required'],
    min:[0 , 'Stock cannot be negative'],
    default:0
  },
  image_url:{
    type:String,
    required:[true,'Image is required']
  },
  category:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required:[true , 'Category is required']
  },
  subcategory:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Subcategory',
    required:[true, 'Subcategory is required']
  },
  is_deleted:{
    type:Boolean,
    default:false
  }
},{
    timestamps:true
  });

module.exports = mongoose.model('Product' , productSchema)