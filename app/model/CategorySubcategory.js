const mongoose = require('mongoose');

const CategorySubcategorySchema = new mongoose.Schema({
  categoryName: String,
  subcategories: [{ name: String }]
},{versionKey:false,timestamps:true});

module.exports = mongoose.model('CategorySubcategory', CategorySubcategorySchema);
