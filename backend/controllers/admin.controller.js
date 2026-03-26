const {createBackup} = require('../services/backup.service');
const {restoreBackup} = require('../services/restore.service');
const User = require('../models/user.model');
const catchAsync = require('../utilities/catchAsync');
const AppError =require('../utilities/appError');

// creat backup 
exports.createBackup = (req, res)=>{
  try {
    createBackup();
    res.status(201).json({message:`BACKUP CREATED`});
  } catch (error) {
    res.status(500).json({message:'Backup error', error: error.message});
  } 
};

// restore backup
exports.restoreBackup = (req, res)=>{
  try{
    restoreBackup(req.params.myBackupsFolder);
    res.status(201).json({message:'BACKUP RESTORED'});
  } catch (error) {
    res.status(500).json({message:'Restore error' , error:error.message});
  }
};

// get all users -- admin
exports.getAllUsers = catchAsync(async(req, res, next )=>{
  const users = await User.find();
  res.status(200).json({
    status:'success',
    results: users.length,
    data:users 
  });
});

// Toggle user active status -- admin
exports.toggoleUserStatus = catchAsync(async(req, res, next)=>{
  const user = await User.findById(req.params.id);

  if(!user) {
    return next (new AppError('User NOT found ', 404));
  }

  user.is_active = !user.is_active;
  await user.save();

  res.status(200).json({
    status:'success',
    message:`User ${user.is_active ? 'activated' : 'deactivated'} successfully`,
    data:user
  });
});