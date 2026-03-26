const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware');


router.get('/sales' , authenticate , authorize('admin') ,reportController.getSalesReport);

module.exports = router;