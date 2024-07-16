const Order = require('../models/order');
const Product = require('../models/Product');
const CustomError = require('../utilis/customError');

// Create a new order
exports.createOrder = async (req, res, next) => {
  try {
    const { productId, quantity, address } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return next(new CustomError(res.__('product_not_found'), 400));
    }
    // Calculate total price
    const discountPrice = product.price * (1 - product.discount / 100);
    const totalPrice = discountPrice * quantity;

    const order = new Order({
      user: req.user.id,
      product: productId,
      quantity,
      totalAmount: totalPrice,
      address
    });
    await order.save();
    return res.success({ msg: res.__('order_created'), order });
  } catch (err) {
    next(err);
  }
};

// Get all orders for the logged-in user
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    return res.success({ orders });
  } catch (err) {
    next(err);
  }
};

// Get a single order by ID for the logged-in user
exports.getUserOrderById = async (req, res, next) => {
  try {
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new CustomError(res.__('order_not_found'), 404));
    }
    return res.success({ order });
  } catch (err) {
    next(err);
  }

};

// Update an order by ID
exports.updateOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedOrder) {
      return next(new CustomError(res.__('order_not_found'), 404));
    }
    return res.success({ msg: res.__('order_updated'), order: updatedOrder });
  } catch (err) {
    next(err);
  }
};

// Delete an order by ID
exports.deleteOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return next(new CustomError(res.__('order_not_found'), 404));
    }
    return res.success({ msg: res.__('order_deleted') });
  } catch (err) {
    next(err);
  }
};
