const express = require('express');
const router = express.Router();
const UniversityController = require('../controllers/UniversityController');

router.post('/', UniversityController.create);
router.get('/', UniversityController.getAll);
router.get('/:id', UniversityController.getById);
router.put('/:id', UniversityController.update);
router.delete('/:id', UniversityController.delete);

module.exports = router;
