const express = require("express");
const {
  createParlor,
  getAllParlors,
  getParlorById,
  updateParlor,
  deleteParlor,
  getAllUsers,
  getMyParlor,
  updateMyParlor,
  addService,
  updateService,
  deleteService,
  updateParlorImages,
} = require("../../controllers/admin/parlor-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Admin routes for parlor management
router.post("/create", createParlor);
router.get("/get", getAllParlors);
router.get("/get/:id", getParlorById);
router.put("/update/:id", updateParlor);
router.delete("/delete/:id", deleteParlor);
router.get("/users", getAllUsers);

// Parlor owner routes (protected)
router.get("/my-parlor/:ownerId", authMiddleware, getMyParlor);
router.put("/my-parlor/:parlorId", authMiddleware, updateMyParlor);
router.post("/my-parlor/:parlorId/services", authMiddleware, addService);
router.put(
  "/my-parlor/:parlorId/services/:serviceId",
  authMiddleware,
  updateService
);
router.delete(
  "/my-parlor/:parlorId/services/:serviceId",
  authMiddleware,
  deleteService
);
router.put("/my-parlor/:parlorId/images", authMiddleware, updateParlorImages);

module.exports = router;
