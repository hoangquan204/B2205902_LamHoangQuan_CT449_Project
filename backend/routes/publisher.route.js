const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/publisher.controller');

router.get('/', publisherController.getAllPublisher);
router.post('/', publisherController.createPublisher);

module.exports = router;