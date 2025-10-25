const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { verifyToken } = require('../middlewares/verifyToken');
const { verifyUser } = require('../middlewares/auth');

router.get('/:id', commentController.getAllCommentByMaSach);
router.post('/:id',verifyToken,verifyUser, commentController.createComment);

module.exports = router;