const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/create-product', authMiddleware, productController.createProduct);
router.get('/all-product', productController.getAllProducts);
router.get('/single-product/:id', productController.getProductById);
router.put('/update-single-product/:id', authMiddleware, productController.updateProductById);
router.delete('/delete-single-product/:id', productController.deleteProductById);

module.exports = router;
