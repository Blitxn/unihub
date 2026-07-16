const express = require('express');
const router = express.Router();
const TuitionFeeController = require('../controllers/TuitionFeeController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRole('admin'), TuitionFeeController.create);
router.get('/', authenticateToken, TuitionFeeController.getAll);
router.get('/major/:majorId', authenticateToken, TuitionFeeController.getByMajor);
router.get('/university/:universityId', authenticateToken, TuitionFeeController.getByUniversity);
router.get('/:id', authenticateToken, TuitionFeeController.getById);
router.put('/:id', authenticateToken, authorizeRole('admin'), TuitionFeeController.update);
router.delete('/:id', authenticateToken, authorizeRole('admin'), TuitionFeeController.delete);

module.exports = router;
