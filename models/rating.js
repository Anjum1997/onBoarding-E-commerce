const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
  },
  product: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
       required: true
       },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: String,
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
