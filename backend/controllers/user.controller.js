const User = require('../models/user.model');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');


// added this function to filter req.body fields
// it ensures only allowed fields are updated
// and prevents unprovided fields from being saved as undefined
const filterObj = (obj, ...allowedFields) =>{
  const newObj = {};
  Object.keys(obj).forEach(key =>{
    if(allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};





// get my profile 
exports.getMyProfile = catchAsync (async (req, res, next) =>{
  const user = req.user;
  res.status(200).json({
    status:'success',
    data: user
  });
});

// update my profile 
exports.updateMyProfile = catchAsync (async (req, res, next)=>{
  const filteredBody = filterObj(req.body, 'name', 'phone', 'address'); 

  const user = await User.findByIdAndUpdate(
    req.user._id,
    filteredBody,
    {new:true, runValidators:true }
  );
  
  res.status(200).json({
    status:'success',
    data: user
  });
});

//change my password 
exports.changeMyPassword = catchAsync (async (req, res, next) =>{
  const {currentPassword, newPassword} = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if(!(await user.isCorrectPassword(currentPassword))){
    return next(new AppError('Current password is incorrect', 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status:'success',
    message:'Password changed successfully'
  });
});