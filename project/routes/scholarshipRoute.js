const express = require('express');
const router = express.Router();
const ScholarshipController = require('../controllers/ScholarshipController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRole('admin'), ScholarshipController.create);
router.get('/', authenticateToken, ScholarshipController.getAll);
router.get('/details', authenticateToken, ScholarshipController.getAllWithDetails);
router.get('/university/:universityId', authenticateToken, ScholarshipController.getByUniversity);
router.get('/detail/:id', authenticateToken, ScholarshipController.getDetailById);
router.get('/:id', authenticateToken, ScholarshipController.getById);
router.put('/:id', authenticateToken, authorizeRole('admin'), ScholarshipController.update);
router.delete('/:id', authenticateToken, authorizeRole('admin'), ScholarshipController.delete);

module.exports = router;
