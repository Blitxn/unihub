const express = require('express');
const router = express.Router();
const TuitionFeeController = require('../controllers/TuitionFeeController');

router.post('/', TuitionFeeController.create);
router.get('/', TuitionFeeController.getAll);
router.get('/:id', TuitionFeeController.getById);
router.get('/major/:majorId', TuitionFeeController.getByMajor);
router.get('/university/:universityId', TuitionFeeController.getByUniversity);
router.put('/:id', TuitionFeeController.update);
router.delete('/:id', TuitionFeeController.delete);

module.exports = router;
