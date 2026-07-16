const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/refresh', UserController.refreshToken);
router.get('/', authenticateToken, authorizeRole('admin'), UserController.getAll);
router.get('/:id', authenticateToken, UserController.getById);
router.put('/:id', authenticateToken, UserController.update);
router.delete('/:id', authenticateToken, authorizeRole('admin'), UserController.delete);

module.exports = router;
