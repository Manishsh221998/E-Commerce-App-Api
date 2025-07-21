const sendEmailCredentials = require("../helper/sendEmailCredentials");
const comparePassword = require("../middleware/comparePassword");
const generateUserToken = require("../middleware/createUserToken");
const hashPassword = require("../middleware/hashPassword");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Role = require("../model/Role");
const fs = require('fs');
const generatePassword = require("../helper/generatePassword");

class userController{
 // Create new user
  async createUser(req, res) {
    try {
      const { name, email, roleName } = req.body;

      if (!name || !email || !roleName) {
        return res.status(400).json({ message: "Name, email, and roleName are required" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

       // Prevent creation of "Super Admin" role by this route
     if (roleName === "Super Admin") {
      return res.status(403).json({ message: "You are not authorized to create a Super Admin" });
     }

      const role = await Role.findOne({ name: roleName });
      if (!role) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const password = generatePassword();
      const hashedPassword = await hashPassword(password);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: role._id,
        roleName:role.name
      });

      await user.save();

       await sendEmailCredentials(user,password);

      return res.status(201).json({
        message: "User created successfully",
        data:user,
        plainPassword: password
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // List all users with role name
 async listUsers(req, res) {
  try {
    const users = await User.find();

    res.status(200).json({message:"Users Fetched Successfully",totalCount:users.length,data:users} );
  } catch (error) {
    console.error("Error listing users:", error);
    res.status(500).json({ message: "Failed to list users" });
  }
 }

  // Login 
 async login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).populate('role');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate token
    const token = await generateUserToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.name
      }
    });

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
 }

// Toggle user active status
async toggleUserStatus(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User status updated to ${user.isActive ? "active" : "inactive"}`,
      isActive: user.isActive
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ message: "Failed to update user status" });
  }
}

// Update a user's information  
async updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, roleName, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent updating Super Admin
    if (user.roleName === "Super Admin") {
      return res.status(403).json({ message: "You are not authorized to update the Super Admin" });
    }

    // Prevent assigning Super Admin role
    if (roleName === "Super Admin") {
      return res.status(403).json({ message: "Cannot assign Super Admin role" });
    }

    // Validate new email is not used by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    // Prepare update object
    const updateFields = {};

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (typeof isActive === 'boolean') updateFields.isActive = isActive;

    if (roleName) {
      const role = await Role.findOne({ name: roleName });
      if (!role) {
        return res.status(400).json({ message: "Invalid role name" });
      }
      updateFields.role = role._id;
      updateFields.roleName = role.name;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
}

// Delete a user
async deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found or already deleted" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
}

}

module.exports=new userController