const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/verifyToken');
const {verifyStaff } = require('../middlewares/auth');

router.get('', verifyToken, userController.getAllUser);
router.get('/profile',verifyToken, userController.getUser);
router.get('/:id',verifyToken,verifyStaff, userController.getUserInfo);
router.post('/', userController.createUser);
router.put('/', verifyToken, userController.updateUser);
router.delete('/:id', verifyToken, userController.deleteUser);
router.post('/login', userController.loginUser);


module.exports = router;
