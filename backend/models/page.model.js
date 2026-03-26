const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  slug:{
    type:String,
    required:[true, 'Slug is required'],
    unique:true,
    lowercase:true,
    trim:true,
    enum:['about', 'contact', 'faq']
  },
  title:{
    type:String,
    required:[true, 'Title is required'],
    trim:true
  },
  content:{
    type:String,
    required:[true, 'Content is required'],
    trim:true
  }
},{
  timestamps:true
});

module.exports = mongoose.model('Page' , pageSchema)