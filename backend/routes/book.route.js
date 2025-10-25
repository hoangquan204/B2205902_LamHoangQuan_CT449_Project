const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { verifyToken } = require('../middlewares/verifyToken');
const { verifyStaff } = require('../middlewares/auth');


router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBook);
router.post('/', verifyToken,verifyStaff, bookController.createBook);
router.put('/:id', verifyToken,verifyStaff, bookController.updateBook);
router.delete('/:id', verifyToken,verifyStaff, bookController.deleteBook);

module.exports = router;