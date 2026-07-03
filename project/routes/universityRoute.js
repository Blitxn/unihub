const express = require('express');
const router = express.Router();
const UniversityController = require('../controllers/UniversityController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, UniversityController.create);
router.get('/', authenticateToken, UniversityController.getAll);
router.get('/:id', authenticateToken, UniversityController.getById);
router.put('/:id', authenticateToken, UniversityController.update);
router.delete('/:id', authenticateToken, UniversityController.delete);

module.exports = router;
