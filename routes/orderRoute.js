const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/create-order', authMiddleware, orderController.createOrder);
router.get('/all-order', authMiddleware, orderController.getUserOrders);
router.get('/single-order/p/:id',authMiddleware, orderController.getUserOrderById);
router.put('/update-single-order/:id', authMiddleware, orderController.updateOrderById);
router.delete('/delete-single-order/:id', authMiddleware, orderController.deleteOrderById);

module.exports = router;
