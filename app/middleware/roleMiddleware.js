const Role = require("../model/Role");

module.exports = function(requiredRoles) {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
      }

      // Fetch user's role from DB
      const userRole = await Role.findById(req.user.roleId);
      if (!userRole) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // Check if user's role is in the allowed roles
      if (!requiredRoles.includes(userRole.name)) {
        return res.status(403).json({ message: "Access denied: Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({ message: "Internal server error in role check" });
    }
  };
};

