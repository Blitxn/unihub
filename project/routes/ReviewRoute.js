// routes/reviewRoute.js
const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, ReviewController.create);
router.get('/ratings', authenticateToken, ReviewController.getAllRatings);
router.get('/university/:universityId', authenticateToken, ReviewController.getByUniversity);
router.get('/university/:universityId/summary', authenticateToken, ReviewController.getRatingSummary);
router.delete('/:id', authenticateToken, ReviewController.delete);

module.exports = router;