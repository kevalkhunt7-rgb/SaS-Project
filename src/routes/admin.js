const express = require("express");
const { getAdminStats, getAllUsers, getAllBusinesses, updateUserRole, deleteUser, deleteBusiness } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const router = express.Router();

// All routes here require authentication and admin role
router.use(authMiddleware);
router.use(authorizeRoles("admin"));

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.get("/businesses", getAllBusinesses);
router.patch("/user-role", updateUserRole);
router.delete("/user/:id", deleteUser);
router.delete("/business/:id", deleteBusiness);

module.exports = router;
