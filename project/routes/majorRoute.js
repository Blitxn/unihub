const express = require('express');
const router = express.Router();
const MajorController = require('../controllers/MajorController');

router.post('/', MajorController.create);
router.get('/', MajorController.getAll);
router.get('/:id', MajorController.getById);
router.get('/university/:universityId', MajorController.getByUniversity);
router.put('/:id', MajorController.update);
router.delete('/:id', MajorController.delete);

module.exports = router;
