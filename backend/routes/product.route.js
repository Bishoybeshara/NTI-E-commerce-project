const express = require('express');
const router  = express.Router();
const productController = require('../controllers/product.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware')
const upload = require('../middlewares/upload.middleware');

// public routes 
router.get('/',productController.getAllProducts);
router.get('/:slug',productController.getProductBySlug);

// Admin routes 
router.post('/' , authenticate , authorize('admin') , upload.single('image') , productController.addProduct);
router.put('/:id' , authenticate , authorize('admin') , upload.single('image') ,productController.updateProduct );
router.delete('/:id' . authenticate , authorize('admin') , productController.deleteProduct);

module.exports = router;