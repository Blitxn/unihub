const express = require('express');
const router = express.Router();
const ProgramController = require('../controllers/ProgramController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, ProgramController.getAll);
router.get('/university/:universityId', authenticateToken, ProgramController.getByUniversity);

module.exports = router;