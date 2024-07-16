const Rating = require('../models/rating');
const Product = require('../models/Product');
const CustomError = require('../utilis/customError');

// Add rating to a product
exports.addRating = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return next(new CustomError(res.__('product_not_found'), 404));
    };
    const existingRating = await Rating.findOne({ user: req.user.id, product: productId });
    if (existingRating) {
      return next(new CustomError(res.__('rating_already_exists'), 400));
    };
    const ratingRecord = new Rating({ user: req.user.id, product: productId, rating, comment });
    await ratingRecord.save();

    product.ratingCount += 1; // Increase rating count
    await product.save();
    return res.success({ msg: res.__('rating_added'), ratingRecord });
  } catch (err) {
    next(err);
  }
};


// Get all ratings for a product
exports.getRatingsByProductId = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const ratings = await Rating.find({ product: productId });

    if (!ratings) {
      return next(new CustomError(res.__('no_ratings_found'), 404));
    }

    return res.success({ ratings });
  } catch (err) {
    next(err);
  }
};

// Get average rating for a product 
exports.getAverageRatingByProductId = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await Product.aggregate([
      {
        $lookup: {
          from: 'ratings',
          let: { productId: '$_id' },
          pipeline: [
            { $match:
               { $expr: { $eq: ['$product', '$$productId'] } } },
            { $group: { _id: '$product', averageRating: { $avg: '$rating' } , ratingCount: { $sum: 1 }} }
          ],
          as: 'ratings'
        }
      },
      { $unwind: '$ratings' },
      { $project: { averageRating: '$ratings.averageRating' , ratingCount: '$ratings.ratingCount'} }
    ]);

    if (!result.length) {
      return next(new CustomError(res.__('no_ratings_found'), 404));
    }
    // Round the average rating to one decimal place
    const averageRating = parseFloat(result[0].averageRating.toFixed(1));
    return res.success({ productId, averageRating,ratingCount: result[0].ratingCount });
  } catch (err) {
    next(err);
  }
};
// Update rating by user
exports.updateRatingByUser = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    const ratingRecord = await Rating.findOneAndUpdate(
      { user: req.user.id, product: productId },
      { rating, comment },
      { new: true }
    );
    if (!ratingRecord) {
      return next(new CustomError(res.__('rating_not_found'), 404));
    }
    return res.success({ msg: res.__('rating_updated'), ratingRecord });
  } catch (err) {
    next(err);
  }
};


// Delete rating by user
exports.deleteRatingByUser = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const ratingRecord = await Rating.findOneAndDelete({ user: req.user.id, product: productId });
    if (!ratingRecord) {
      return next(new CustomError(res.__('rating_not_found'), 404));
    }
    const product = await Product.findById(productId);
    if (product) {
      product.ratingCount -= 1; // Decrease rating count
      await product.save();
    }
    return res.success({ msg: res.__('rating_deleted') });
  } catch (err) {
    next(err);
  }
};