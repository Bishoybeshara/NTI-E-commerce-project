const Testimonial = require('../models/testimonial.model');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');

// create testimonial -user-
exports.createTestimonial = catchAsync(async (req, res, next)=>{
  const {content , rating} = req.body;

  const testimonial = await Testimonial.create({
    user: req.user._id,
    content,
    rating
  });
  
  res.status(201).json({
    status:'success',
    message:'Your review has been submitted and is pending approval',
    data: testimonial
  });
});

// Get approved testimonials - public
exports.getApprovedTestimonials = catchAsync(async(req, res, next)=>{
  const testimonials = await Testimonial.find({status:'approved'})
    .populate('user' , 'name')
    .sort({createdAt: -1});

    res.status(200).json({
      status:'success',
      results: testimonials.length,
      data:testimonials
    });
});

// get all testimonials - admin
exports.getAllTestimonials = catchAsync(async(req, res, next)=>{
  const {status} = req.query;

  const filter = {};
  if(status) filter.status = status;

  const testimonials = await Testimonial.find(filter)
    .populate('user' , 'name email')
    .sort({createdAt:-1});

    res.status(200).json({
      status:'success',
      results: testimonials.length,
      data: testimonials
    });
});


// update testimonial status - admin 
exports.updateTestimonalStatus = catchAsync(async(req, res, next)=>{
  const {status} =req.body;

  const testimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    {status},
    {new : true , runValidators: true }
  );

  if (!testimonial){
    return next(new AppError('Testimonial not found' , 404));
  }

  res.status(200).json({
    status:'success',
    data: testimonial
  });
});