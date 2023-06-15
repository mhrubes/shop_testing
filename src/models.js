// models.js
const mongoose = require('mongoose');

// Definice schématu pro model produktu
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  // další pole a validace podle potřeby
});

// Vytvoření modelu "Product" na základě schématu
const Product = mongoose.model('Product', productSchema);

module.exports = {
  Product
};
