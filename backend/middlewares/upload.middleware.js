const multer = require('multer');
const path = require('path');
const AppError = require('../utilities/appError');

const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'uploads');
  },
  filename:(req, file, cb) =>{
    const ext = path.extname(file.originalname);
    const uniqueName = `product-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb)=>{
  if(file.mimetype.startsWith('image/')){
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed', 400) , false);
  }
};

const maxFileSize = 4 * 1024 * 1024; // 4MB

const upload = multer({
  storage,
  fileFilter,
  limits :{fileSize: maxFileSize}
});

module.exports = upload;