const express = require('express');
const router = express.Router()
const productController  = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.route('/').get(productController.getProducts).post(authMiddleware.protect, authMiddleware.admin, productController.createProduct);
router.route('/:id/reviews').post(authMiddleware.protect, productController.createProductReview)
router.get('/top', productController.getTopProducts)
router
.route('/:id')
.get(productController.getProductById)
.delete(authMiddleware.protect, authMiddleware.admin, productController.deleteProduct)
.put(authMiddleware.protect, authMiddleware.admin, productController.updateProduct);

module.exports = router;