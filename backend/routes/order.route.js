const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware');

// user 
router.post('/' , authenticate , orderController.createOrder);
router.get('/my-orders', authenticate , orderController.getMyOrders);
router.get('/my-orders/:id' , authenticate , orderController.getOrderById);
router.put('/my-orders/:id' , authenticate , orderController.updateOrder);
router.put('/my-orders/:id/cancel' , authenticate , orderController.cancelOrder);


// admin 
router.get('/' , authenticate , authorize ('admin') , orderController.getAllOrders);
router.put('/:id/status' , authenticate , authorize ('admin') , orderController.updateOrderStatus);

module.exports = router;