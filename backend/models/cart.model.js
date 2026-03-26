const mongoose =require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product',
    required:[true, 'Product is required']
  },
  quantity:{
    type:Number,
    required:[true , 'Quantity is required'],
    min:[1, 'Quantity must be at least 1' ],
    default:1
  },
  unit_price:{
    type:Number,
    required:[true, 'Unit price is required']
  }
});

const cartSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    default:null
  },
  session_id:{
    type:String,
    default:null
  },
  items:[cartItemSchema],
  total_price:{
    type:Number,
    default:0
  }
},{
  timestamps:true
});

// should delete (next) == the new mongoose version did not accept to take next as a parameter in the async function {pre save}  >> mongoose act with async as a promise so no need to use next
cartSchema.pre('save', async function(){
  this.total_price = this.items.reduce((acc, item)=>{
    return acc + (item.quantity * item.unit_price);
  }, 0 );
});

cartSchema.path('user').validate(function(){
  return this.user || this.session_id;
}, 'Cart must have either a user or session_id')



module.exports = mongoose.model('Cart' , cartSchema)