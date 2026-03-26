const express = require('express');
const router = express.Router();
const pageController = require('../controllers/page.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware');

// public Guest , user 
router.get('/:slug' , pageController.getPage);

// adminn
router.put('/:slug' , authenticate , authorize('admin') , pageController.updatePage);


module.exports = router;