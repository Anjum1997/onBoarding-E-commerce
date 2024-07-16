const Product = require('../models/Product');
const CustomError = require('../utilis/customError');

// Create a new product
exports.createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    await product.save();
    return res.success({ msg: res.__('product_created'), product });
  } catch (err) {
    next(err);
  }
};

// Get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    return res.success({ products });
  } catch (err) {
    next(err);
  }
};

// Get a single product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new CustomError(res.__('product_not_found'), 404));
    }
    return res.success({ product });
  } catch (err) {
    next(err);
  }
};

// Update a product by ID
exports.updateProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) {
      return next(new CustomError(res.__('product_not_found'), 404));
    }
    return res.success({ msg: res.__('product_updated'), product: updatedProduct });
  } catch (err) {
    next(err);
  }
};

// Delete a product by ID
exports.deleteProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return next(new CustomError(res.__('product_not_found'), 404));
    }
    return res.success({ msg: res.__('product_deleted') });
  } catch (err) {
    next(err);
  }
};
