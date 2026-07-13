const express = require('express');
const router = express.Router();
const TuitionFeeController = require('../controllers/TuitionFeeController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, TuitionFeeController.create);
router.get('/', authenticateToken, TuitionFeeController.getAll);
router.get('/major/:majorId', authenticateToken, TuitionFeeController.getByMajor);
router.get('/university/:universityId', authenticateToken, TuitionFeeController.getByUniversity);
router.get('/:id', authenticateToken, TuitionFeeController.getById);
router.put('/:id', authenticateToken, TuitionFeeController.update);
router.delete('/:id', authenticateToken, TuitionFeeController.delete);

module.exports = router;
