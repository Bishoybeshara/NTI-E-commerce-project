const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware');
const subcategoryRouter  =require('./subcategory.route')
// const AppError = require('../utilities/appError')

//nested routes 
router.use('/:categoryId/subcategories', subcategoryRouter);


// Public routes 
router.get('/', categoryController.getAllCategories);

// Admin routes 
router.post('/' , authenticate , authorize('admin') , categoryController.addCategory);
router.put('/:id' , authenticate , authorize('admin'), categoryController.updateCategory);
router.delete('/:id' , authenticate , authorize('admin') , categoryController.deleteCategory)

module.exports = router;