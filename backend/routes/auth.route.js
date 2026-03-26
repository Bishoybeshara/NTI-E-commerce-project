const express =require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const cartController = require('../controllers/cart.controller');

router.post('/register', authController.register);
// router.post('/login', authController.login);
router.post('/login' , authController.login , cartController.mergeCart);

module.exports = router;