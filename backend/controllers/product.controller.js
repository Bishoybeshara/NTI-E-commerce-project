const Product = require('../models/product.model');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');


const filterObj = (obj, ...allowedFields) =>{
  const newObj = {};
  Object.keys(obj).forEach(key =>{
    if(allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
}


// Get all products
exports.getAllProducts = catchAsync (async (req, res, next)=>{
  const {category, subcategory, search} = req.query;

  const filter = {is_deleted : false};

  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;
  if (search) filter.name = {$regex: search, $options: 'i'};

  const products = await Product.find(filter)
    .populate({path:'category' , match:{is_deleted:false},select:'name'})
    .populate('subcategory' ,'name');

    res.status(200).json({
      status:'success',
      results: products.length,
      data: products
    });
});

// Get product by slug 
exports.getProductBySlug = catchAsync(async (req, res, next)=>{
  const product = await Product.findOne({ slug: req.params.slug, is_deleted:false})
    .populate({path:'category' , match:{is_deleted:false},select:'name'})
    .populate('subcategory', 'name');

  if (!product){
    return next(new AppError('Product not found',404));
  }

  res.status(200).json({
    status:'success',
    data:product
  });
});

// Add product (admin)
exports.addProduct = catchAsync(async (req, res, next)=>{
  const {name, slug, description, price, priceAfterDiscount, stock_quantity, category, subcategory} = req.body;
  const image_url = req.file ? req.file.filename : null;

  if(!image_url){
    return next(new AppError('Product image is required' , 400));
  }

  const product = await Product.create({
    name, slug, description, price, priceAfterDiscount,
    stock_quantity, category, subcategory, image_url
  });
  res.status(201).json({
    status:'success',
    data:product
  });
});

// Update product (admin) 
exports.updateProduct = catchAsync (async (req, res, next)=>{
  const filteredBody = filterObj(req.body, 'name','description','price' ,'priceAfterDiscount','stock_quantity','category','subcategory');
  
  if (req.file) filteredBody.image_url = req.file.filename;

  const product = await Product.findOneAndUpdate(
    {_id:req.params.id, is_deleted:false},
    filteredBody,
    {new: true, runValidators: true, context:'query'}
  );
  if(!product){
    return next(new AppError('Product not found', 404));
  }
  res.status(200).json({
    status:'success',
    data:product
  });
});

// Soft delete product (Admin)
exports.deleteProduct = catchAsync(async (req, res, next)=>{
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {is_deleted:true},
    {new:true}
  );
  if(!product) {
    return next(new AppError('Product not found', 404));
  }
  res.status(200).json({
    status:'success',
    message:'Product deleted successfully'
  });
});
