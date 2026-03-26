const Subcategory = require('../models/subcategory.model');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const Product = require('../models/product.model');

const filterObj = (obj, ...allowedFields)=>{
  const newObj = {};
  Object.keys(obj).forEach(key =>{
    if(allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

// get all subcategories (or subcategories belonging to one category)

exports.getAllSubcategories = catchAsync(async (req, res, next)=>{
  const filter = {is_deleted:false};
  // if send category id in query will return its subcategories
  if (req.params.categoryId) filter.category = req.params.categoryId;
  else if(req.query.category) filter.category = req.query.category;

  let subcategories = await Subcategory.find(filter)
    .populate({path:'category', match:{is_deleted:false}, select:'name'});

    // filter the subcategories whose category dleted 
    subcategories = subcategories.filter(sub => sub.category !== null)
    res.status(200).json({
      status:'success',
      results: subcategories.length,
      data:subcategories
    });
});


// add subcategory (admin)
exports.addSubcategory = catchAsync(async(req, res, next)=>{
  const {name, slug, category} = req.body;

  const subcategory = await Subcategory.create({name, slug, category});

  res.status(201).json({
    status:'success',
    data:subcategory
  });
});


// update subcategory (admin)
exports.updateSubcategory = catchAsync(async(req, res, next)=>{
  const filteredBody = filterObj(req.body, 'name', 'slug', 'category');

  const subcategory = await Subcategory.findOneAndUpdate(
    {_id:req.params.id , is_deleted:false},
    filteredBody,
    {new: true, runValidators: true}
  );

  if(!subcategory){
    return next(new AppError('Subcategory not found',404));
  }
  res.status(200).json({
    status:'success',
    data:subcategory
  });
});

// soft delete subcategory (admin)
exports.deleteSubcategory = catchAsync(async(req, res, next)=>{
  const subcategory = await Subcategory.findByIdAndUpdate(
    req.params.id,
    {is_deleted:true},
    {new:true}
  );
  if(!subcategory){
    return next(new AppError('Subcategory not found', 404));
  }

  //if admin want to delete products inside the deleted subcategory 
  if(req.query.deleteProducts === 'true'){
    await Product.updateMany(
      {subcategory:req.params.id},
      {is_deleted:true}
    );
  }
  res.status(200).json({
    status:'success',
    message:'Subcategory deleted successfully'
  });
});






