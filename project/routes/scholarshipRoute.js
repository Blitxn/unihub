const express = require('express');
const router = express.Router();
const ScholarshipController = require('../controllers/ScholarshipController');

router.post('/', ScholarshipController.create);
router.get('/', ScholarshipController.getAll);
router.get('/:id', ScholarshipController.getById);
router.get('/university/:universityId', ScholarshipController.getByUniversity);
router.put('/:id', ScholarshipController.update);
router.delete('/:id', ScholarshipController.delete);

module.exports = router;
