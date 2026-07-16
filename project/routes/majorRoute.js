const express = require('express');
const router = express.Router();
const MajorController = require('../controllers/MajorController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRole('admin'), MajorController.create);
router.get('/', authenticateToken, MajorController.getAll);
router.get('/university/:universityId', authenticateToken, MajorController.getByUniversity);
router.get('/:id', authenticateToken, MajorController.getById);
router.put('/:id', authenticateToken, authorizeRole('admin'), MajorController.update);
router.delete('/:id', authenticateToken, authorizeRole('admin'), MajorController.delete);

module.exports = router;
