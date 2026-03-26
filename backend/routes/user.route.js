const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const {authenticate} = require('../middlewares/auth.middleware')

router.use(authenticate);

router.get('/me', userController.getMyProfile);
router.put('/me', userController.updateMyProfile);
router.put('/me/change-password', userController.changeMyPassword);

module.exports = router;