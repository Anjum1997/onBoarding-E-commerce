const express = require('express');
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/add-rating', authMiddleware, ratingController.addRating);
router.get('/product-rating/:productId', ratingController.getRatingsByProductId);
router.get('/average-rating/:productId', ratingController.getAverageRatingByProductId);
router.put('/update-rating', authMiddleware, ratingController.updateRatingByUser);
router.delete('/delete-rating/:productId', authMiddleware, ratingController.deleteRatingByUser);
module.exports = router;
