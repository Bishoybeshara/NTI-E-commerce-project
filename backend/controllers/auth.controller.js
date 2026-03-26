const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');

const signToken = (user)=>{
  const{_id, name, role} = user;
  return jwt.sign(
    {_id, name, role},
    process.env.SECRET_KEY ,
    {expiresIn: process.env.JWT_EXPIRES_IN}
  );
};

exports.register = catchAsync ( async (req, res, next)=>{

  // console.log('body:', req.body);
  // console.log('next type:', typeof next);

  const {name, email, phone, password, gender, address} = req.body;

  const existingUser = await User.findOne({email});
  if(existingUser){
    return next(new AppError('Email already in use', 400));
  }
  
  const user = await User.create({name, email, phone, password, gender, address })
  const token = signToken(user);

  res.status(201).json({
    status:'success',
    token,
    data:{
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

exports.login = catchAsync(async(req, res, next)=>{
  const {email, password} =req.body;

  if(!email || !password){
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({email}).select('+password');
  if(!user || !(await user.isCorrectPassword(password))){
    return next(new AppError('Incorrect email or password', 401));
  }

  if(!user.is_active){
    return next(new AppError('Your account has been deactivated' ,403));
  }

  const token = signToken(user);
  
  res.status(200).json({status:'success',
    token,
    data:{
      name:user.name,
      email:user.email,
      role:user.role
    }
  });
});