// backend/middleware/rbac.js

// Allow specific roles only
const allowRoles = (...roles) => {
  return (req, res, next) => {
    try {
      // Check if user exists (auth middleware should run first)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized. Please login.",
        });
      }

      // Check if user role is allowed
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error:
            "Forbidden. You do not have permission to access this resource.",
        });
      }

      next();
    } catch (error) {
      console.error("❌ RBAC middleware error:", error);
      res.status(500).json({
        success: false,
        error: "Server error",
      });
    }
  };
};

// Specific role middlewares for convenience
const isAdmin = allowRoles("admin");
const isHOD = allowRoles("admin", "hod");
const isTeacher = allowRoles("admin", "hod", "teacher");
const isStudent = allowRoles("admin", "hod", "teacher", "student");
const isParent = allowRoles("admin", "hod", "teacher", "parent");

module.exports = {
  allowRoles,
  isAdmin,
  isHOD,
  isTeacher,
  isStudent,
  isParent,
};
