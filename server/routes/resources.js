const express = require('express');
const router = express.Router();
const { voteResource, deleteResource } = require('../controllers/resourceController');
const { protect } = require('../middleware/auth');

router.post('/:id/vote', protect, voteResource);
router.delete('/:id', protect, deleteResource);

module.exports = router;
