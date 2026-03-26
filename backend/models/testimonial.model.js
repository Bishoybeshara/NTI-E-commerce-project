const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:[true, 'User is required']
  },
  content:{
    type:String,
    trim:true
  },
  rating:{
    type:Number,
    required:[true, 'Rating is required'],
    min:[1, 'Rating must be at least 1'],
    max:[5, 'Rating must be at most 5']
  },
  status:{
    type:String,
    enum:['pending', 'approved', 'rejected'],
    default:'pending'
  }
},{
  timestamps:true
});

module.exports = mongoose.model('Testimonial', testimonialSchema)