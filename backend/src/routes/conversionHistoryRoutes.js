const express = require('express');
const conversionHistoryController = require('../controllers/ConversionHistoryController');

const router = express.Router();

router.get('/', conversionHistoryController.listConversionHistories);
router.get('/user/:id', conversionHistoryController.listByUserId);
router.get('/:id', conversionHistoryController.getConversionHistoryById);
router.post('/', conversionHistoryController.createConversionHistory);
router.put('/:id', conversionHistoryController.updateConversionHistory);
router.patch('/:id', conversionHistoryController.updateConversionHistory);
router.delete('/:id', conversionHistoryController.deleteConversionHistory);

module.exports = router;
