const mongoose =require('mongoose');
const bcrypt =require('bcrypt')

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required: [true, 'Name is required'],
    trim:true
  },
  email:{
    type:String,
    required: [true, 'Email is required'],
    unique:true,
    lowercase:true,
    trim:true,
    index: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email format']
  },
  phone:{
    type:String,
    required:true,
    trim:true,
    match: [/^01[0125][0-9]{8}$/, 'Please enter a valid Egyptian phone number']

  },
  password:{
    type:String,
    required:true,
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  gender:{
    type:String,
    enum:['male' ,'female'],
    required:true
  },
  address:{
    type:String,
    trim:true
  },
  role:{
    type:String,
    enum:['admin' ,'user'],
    default:'user'
  },
  is_active:{
    type:Boolean,
    default:true
  }
},{
  timestamps:true
});


// the new mongoose version did not accept to take next as a parameter in the async function {pre save}  >> mongoose act with async as a promise so no need to use next
userSchema.pre('save', async function() {      
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.isCorrectPassword =async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);  
};

module.exports = mongoose.model('User' , userSchema);