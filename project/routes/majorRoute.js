const express = require('express');
const router = express.Router();
const MajorController = require('../controllers/MajorController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, MajorController.create);
router.get('/', authenticateToken, MajorController.getAll);
router.get('/university/:universityId', authenticateToken, MajorController.getByUniversity);
router.get('/:id', authenticateToken, MajorController.getById);
router.put('/:id', authenticateToken, MajorController.update);
router.delete('/:id', authenticateToken, MajorController.delete);

module.exports = router;
