const express = require('express');
const router = express.Router({mergeParams:true});
const subcategoryController = require('../controllers/subcategory.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware')


// public routes 
router.get('/' , subcategoryController.getAllSubcategories);

// Admib routes
router.post('/', authenticate , authorize('admin') , subcategoryController.addSubcategory);
router.put('/:id', authenticate , authorize('admin') , subcategoryController.updateSubcategory);
router.delete('/:id' , authenticate , authorize('admin') , subcategoryController.deleteSubcategory);


module.exports = router;
