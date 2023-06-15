const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  role: Array,
});

const ItemUser = mongoose.model('ItemUser', userSchema, 'users');

module.exports = {
  ItemUser
};