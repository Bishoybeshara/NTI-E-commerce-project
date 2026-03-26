const Page = require('../models/page.model');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');

// get page by slug 
exports.getPage = catchAsync(async(req, res, next)=>{
  const page = await Page.findOne({slug: req.params.slug});

  if(!page) {
    return next(new AppError('Page not found' , 404));
  }

  res.status(200).json({
    status:'success',
    data: page
  });
});

// update page by admin
exports.updatePage = catchAsync(async (req, res, next)=>{
  const {title, content} = req.body;

  const page = await Page.findOneAndUpdate(
    {slug: req.params.slug},
    {title , content},
    {new:true , runValidators:true , upsert:true}
  );

  res.status(200).json({
    status:'success',
    data: page
  });
});