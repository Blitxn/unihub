const express = require('express');
const router = express.Router();
const UniversityController = require('../controllers/UniversityController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRole('admin'), UniversityController.create);
router.get('/', authenticateToken, UniversityController.getAll);
router.get('/:id', authenticateToken, UniversityController.getById);
router.put('/:id', authenticateToken, authorizeRole('admin'), UniversityController.update);
router.delete('/:id', authenticateToken, authorizeRole('admin'), UniversityController.delete);

module.exports = router;
