const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true, 'Subcategory name is required'],
    trim:true
  },
  slug:{
    type:String,
    required:[true, 'Slug is required'],
    unique:true,
    lowercase:true,
    trim:true
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required:[true, 'Category is required'],
    index:true
  },
  is_deleted:{
    type:Boolean,
    default:false
  }
},{
  timestamps:true
});

module.exports = mongoose.model('Subcategory', subcategorySchema)