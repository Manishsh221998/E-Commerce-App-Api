const sendEmailCredentials = require("../helper/sendEmailCredentials");
const comparePassword = require("../middleware/comparePassword");
const generateUserToken = require("../middleware/createUserToken");
const hashPassword = require("../middleware/hashPassword");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Role = require("../model/Role");
const fs = require('fs');
const generatePassword = require("../helper/generatePassword");

class AuthController {
  

  // Create new role
  async createRole(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Role name is required" });
      }

      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(400).json({ message: "Role already exists" });
      }

      const role = new Role({ name });
      await role.save();

      return res.status(201).json({
        message: "Role created successfully",
        role
      });
    } catch (error) {
      console.error("Error creating role:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Create Super Admin (only once)
  async createSuperAdmin(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
      }

      // Check if a Super Admin already exists
      const superAdminRole = await Role.findOne({ name: 'Super Admin' });
      if (!superAdminRole) {
        return res.status(400).json({ message: "Super Admin role is not defined in the system" });
      }

      const existingSuperAdmin = await User.findOne({ role: superAdminRole._id });
      if (existingSuperAdmin) {
        return res.status(403).json({ message: "A Super Admin already exists" });
      }

      // Check if the email is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

       const hashedPassword = await hashPassword(password);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: superAdminRole._id,
        isVerified: true  // Optional, based on your app logic
      });

      await user.save();

       // await sendEmailVerification(email, password);

      return res.status(201).json({
        message: "Super Admin created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          password:user.password,
          role: "Super Admin"
        },
       });

    } catch (error) {
      console.error("Error creating Super Admin:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get all roles
  async getAllRoles(req, res) {
    try {
      const roles = await Role.find({});
      return res.status(200).json({
        message: "Roles fetched successfully",
        roles
      });
    } catch (error) {
      console.error("Error fetching roles:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

 
}



module.exports = new AuthController();
