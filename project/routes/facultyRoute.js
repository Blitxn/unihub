const express = require('express');
const router = express.Router();
const FacultyController = require('../controllers/FaculityController'); 

router.post('/', FacultyController.create);
router.get('/', FacultyController.getAll);
router.get('/:id', FacultyController.getById);
router.get('/university/:universityId', FacultyController.getByUniversity);
router.put('/:id', FacultyController.update);
router.delete('/:id', FacultyController.delete);

module.exports = router;
