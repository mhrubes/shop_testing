const mongoose = require('mongoose');

const categoryCreateSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    min: 0,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  active: {
    type: Boolean,
    required: true
  }
});

const categoryUpdateSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    min: 0,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  active: {
    type: Boolean,
    required: true
  }
});

const categoryDeleteSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    min: 0,
  }
});

const ItemCategoryCreate = mongoose.model('ItemCategoryCreate', categoryCreateSchema, 'category');
const ItemCategoryUpdate = mongoose.model('ItemCategoryUpdate', categoryUpdateSchema, 'category');
const ItemCategoryDelete = mongoose.model('ItemCategoryDelete', categoryDeleteSchema, 'category');

module.exports = {
  ItemCategoryCreate,
  ItemCategoryUpdate,
  ItemCategoryDelete
};