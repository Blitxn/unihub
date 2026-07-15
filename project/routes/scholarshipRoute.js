const express = require('express');
const router = express.Router();
const ScholarshipController = require('../controllers/ScholarshipController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, ScholarshipController.create);
router.get('/', authenticateToken, ScholarshipController.getAll);
router.get('/details', authenticateToken, ScholarshipController.getAllWithDetails);
router.get('/university/:universityId', authenticateToken, ScholarshipController.getByUniversity);
router.get('/detail/:id', authenticateToken, ScholarshipController.getDetailById);
router.get('/:id', authenticateToken, ScholarshipController.getById);
router.put('/:id', authenticateToken, ScholarshipController.update);
router.delete('/:id', authenticateToken, ScholarshipController.delete);

module.exports = router;
