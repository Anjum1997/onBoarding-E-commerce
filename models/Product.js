const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
},
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0
},
category: {
    type: String,
},
  stock: {
    type: Number,
    required: true,
  },
ratingCount: { 
  type: Number,
   default: 0
   },
}, 
{ timestamps: true });

module.exports = mongoose.model('Product', productSchema);
