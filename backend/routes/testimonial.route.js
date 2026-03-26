const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonial.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} =require('../middlewares/role.middleware');


//public guser , user 
router.get('/', testimonialController.getApprovedTestimonials);

// user 
router.post('/' , authenticate , testimonialController.createTestimonial);

// admin 
router.get('/all' , authenticate , authorize('admin') , testimonialController.getAllTestimonials);
router.put('/:id/status' , authenticate , authorize('admin') , testimonialController.updateTestimonalStatus);

module.exports = router;