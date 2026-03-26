const jwt =require('jsonwebtoken')
const User =require('../models/user.model')

exports.authenticate = async (req, res , next)=>{
  const authHeader = req.headers.authorization;
  
  if(!authHeader?.startsWith('Bearer ')){
    return res.status(401).json({message:'no token provided'})
  }
  
  const token = authHeader.split(' ')[1];
  
  try{
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded._id);
  

  if(!user){
    return res.status(404).json({message:'invalid user data'});
  }

  if(!user.is_active){
    return res.status(403).json({message:'account is deactivated'})
  }
  req.user = user;
  next();
  }catch(err){
    return res.status(403).json({message:'Invalid or expires token'});
  }
};