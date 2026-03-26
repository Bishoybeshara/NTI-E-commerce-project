const Category = require('../models/category.model');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const Product =require('../models/product.model');
const Subcategory = require('../models/subcategory.model')

const filterObj = (obj, ...allowedFields)=>{
  const newObj ={};
  Object.keys(obj).forEach(key =>{
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj
};




// Get all categories 
exports.getAllCategories = catchAsync (async (req, res, next)=>{
  const categories = await Category.find({is_deleted :false});
  res.status(200).json({
    status:'success',
    results: categories.length,
    data: categories
  });
});

// Add category (Admin) 
exports.addCategory = catchAsync(async(req, res, next)=>{
  const {name, slug} = req.body;
  const category = await Category.create({name , slug});
  res.status(201).json({
    status:'success',
    data: category
  });
});


// update Category (Admin) 
exports.updateCategory = catchAsync(async(req, res, next)=>{
  const filteredBody = filterObj(req.body , 'name' , 'slug');

  const category = await Category.findOneAndUpdate(
    {_id: req.params.id , is_deleted:false},
    filteredBody,
    {new: true, runValidators: true}
  );
  if(!category){
    return next(new AppError('Category not found' , 404));
  }
  res.status(200).json({
    status:'success',
    data:category
  });
});

// Soft delete category (admin)
exports.deleteCategory = catchAsync(async (req, res, next)=>{
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {is_deleted: true},
    {new: true}
  )
  if(!category){
    return next(new AppError('Category not found',404));
  }

  // if the admin want to delete the subcategories inside the deleted category
  if (req.query.deleteSubcategories === 'true') {
    await Subcategory.updateMany(
      { category: req.params.id },
      { is_deleted: true }
    );
  }



  // if the admin want to delete the products inside the deleted category
  if(req.query.deleteProducts === 'true'){
    await Product.updateMany(
      {category: req.params.id},
      {is_deleted:true}
    );
  }

  res.status(200).json({
    status:'success',
    message:'Category deleted successfully'
  });
});






