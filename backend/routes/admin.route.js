const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} =require('../middlewares/role.middleware');



// i could use router.use(authenticate, authorize('admin')) alt repeat the code
router.get('/users' , authenticate , authorize('admin'), adminController.getAllUsers);
router.put('/users/:id/toggle-status' , authenticate , authorize('admin') , adminController.toggoleUserStatus );
router.post('/backup' , authenticate , authorize('admin') , adminController.createBackup);
router.post('/restore/:myBackupsFolder' , authenticate , authorize('admin'), adminController.restoreBackup)


module.exports = router;
