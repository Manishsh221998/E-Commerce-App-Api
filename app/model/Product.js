const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'CategorySubcategory' },
  subcategoryName: String
},{versionKey:false,timestamps:true});

module.exports = mongoose.model('Product', ProductSchema);
