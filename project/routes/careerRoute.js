const express = require('express');
const router = express.Router();
const CareerController = require('../controllers/CareerController');

router.post('/', CareerController.create);
router.get('/', CareerController.getAll);
router.get('/:id', CareerController.getById);
router.put('/:id', CareerController.update);
router.delete('/:id', CareerController.delete);

module.exports = router;
