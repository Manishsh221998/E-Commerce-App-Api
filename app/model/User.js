const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  roleName:String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
},{versionKey:false,timestamps:true});

module.exports = mongoose.model('User', UserSchema);
