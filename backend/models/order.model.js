const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product',
    required:[true, 'Product is required']
  },
  name:{
    type:String,
    required:[true, 'Product name is required']
  },
  image_url:{
    type:String,
    required:[true, 'Product image is required']
  },
  quantity:{
    type:Number,
    required:[true, 'Quantity is required'],
    min:[1, 'Quantity must be at least 1']
  },
  unit_price:{
    type:Number,
    required:[true, 'Unit price is required']
  }
});

const orderSchema = new mongoose.Schema({
  order_code:{      
    type:String,
    unique:true
  }
  //this code for the shipping company alternitive the full UUid
  ,
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:[true, 'User is required']
  },
  items:[orderItemSchema],
  shipping_fee:{
    type:Number,
    default:0
  },
  total_amount:{
    type:Number,
    required:[true, 'Total amount is required']
  },
  status:{
    type:String,
    enum:['pending', 'prepared', 'shipped', 'delivered', 'cancelled_by_user', 'cancelled_by_admin', 'rejected' ],
    default: 'pending'
  },
  phone:{
    type:String,
    required:[true, 'Phone is required'],
    match: [/^01[0125][0-9]{8}$/, 'Please enter a valid Egyptian phone number']
  },
  address:{
    type:String,
    required:[true, 'Address is required'],
    trim:true
  }
},{
  timestamps:true
});

orderSchema.pre('save', function(){
  if(!this.order_code){
    this.order_code = `ORD-${this._id.toString().slice(-8).toUpperCase()}`
  }
})

module.exports = mongoose.model('Order' , orderSchema)