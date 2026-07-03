const express = require('express');
const router = express.Router();
const CareerController = require('../controllers/CareerController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, CareerController.create);
router.get('/', authenticateToken, CareerController.getAll);
router.get('/:id', authenticateToken, CareerController.getById);
router.put('/:id', authenticateToken, CareerController.update);
router.delete('/:id', authenticateToken, CareerController.delete);

module.exports = router;
