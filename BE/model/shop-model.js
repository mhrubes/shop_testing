const mongoose = require('mongoose');

const productCreateSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    min: 0,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  description: {
    type: String,
    required: false,
    minlength: 0,
    maxlength: 1000,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  __v: {
    type: Number,
    required: true,
    min: 0,
  },
});

const productUpdateSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    min: 0,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  description: {
    type: String,
    required: false,
    minlength: 0,
    maxlength: 1000,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  __v: {
    type: Number,
    required: true,
    min: 0,
  },
});

const productDeleteSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    min: 0,
  }
});


const ItemProductCreate = mongoose.model('ItemProductCreate', productCreateSchema, 'shop');
const ItemProductUpdate = mongoose.model('ItemProductUpdate', productUpdateSchema, 'shop');
const ItemProductDelete = mongoose.model('ItemProductDelete', productDeleteSchema, 'shop');

module.exports = {
  ItemProductCreate,
  ItemProductUpdate,
  ItemProductDelete
};