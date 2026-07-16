const express = require('express');
const router = express.Router();
const CareerController = require('../controllers/CareerController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRole('admin'), CareerController.create);
router.get('/', authenticateToken, CareerController.getAll);
router.get('/:id', authenticateToken, CareerController.getById);
router.put('/:id', authenticateToken, authorizeRole('admin'), CareerController.update);
router.delete('/:id', authenticateToken, authorizeRole('admin'), CareerController.delete);

module.exports = router;
