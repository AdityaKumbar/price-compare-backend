const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  price: { type: Number, required: true },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  platform: { type: String, required: true },
  url: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  priceHistory: [priceHistorySchema], // Array of historical prices
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
