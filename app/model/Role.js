const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Super Admin", "Admin", "User"],
    unique: true,
  },
},{versionKey:false,timestamps:true});

module.exports = mongoose.model("Role", RoleSchema);
