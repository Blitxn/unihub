const express = require('express');
const router = express.Router();
const FacultyController = require('../controllers/FaculityController'); 
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRole('admin'), FacultyController.create);
router.get('/', authenticateToken, FacultyController.getAll);
router.get('/university/:universityId', authenticateToken, FacultyController.getByUniversity);
router.get('/:id', authenticateToken, FacultyController.getById);
router.put('/:id', authenticateToken, authorizeRole('admin'), FacultyController.update);
router.delete('/:id', authenticateToken, authorizeRole('admin'), FacultyController.delete);

module.exports = router;
