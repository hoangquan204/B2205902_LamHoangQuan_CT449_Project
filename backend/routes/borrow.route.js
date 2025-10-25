const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrow.controller');
const { verifyToken } = require('../middlewares/verifyToken');
const { verifyStaff } = require('../middlewares/auth');

router.get('/',verifyToken,verifyStaff, borrowController.getAllBorrow);
router.post('/',verifyToken, borrowController.borrowRequest);
router.put('/approve/:id',verifyToken,verifyStaff, borrowController.approveBorrow);
router.put('/reject/:id',verifyToken,verifyStaff, borrowController.rejectBorrow);
router.put('/return/:id',verifyToken, borrowController.returnBook);
router.get('/my',verifyToken, borrowController.getMyBorrowedBooks);

module.exports = router;
