const express = require("express");
const {
  getAllAppointments,
} = require("../../controllers/admin/appointments-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Admin appointment routes
router.get("/all", authMiddleware, getAllAppointments);

module.exports = router;
