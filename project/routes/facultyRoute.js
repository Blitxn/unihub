const express = require('express');
const router = express.Router();
const FacultyController = require('../controllers/FaculityController'); 
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, FacultyController.create);
router.get('/', authenticateToken, FacultyController.getAll);
router.get('/university/:universityId', authenticateToken, FacultyController.getByUniversity);
router.get('/:id', authenticateToken, FacultyController.getById);
router.put('/:id', authenticateToken, FacultyController.update);
router.delete('/:id', authenticateToken, FacultyController.delete);

module.exports = router;
