const express = require("express");
const {
  createAppointment,
  getCustomerAppointments,
  getMyAppointments,
  cancelAppointment,
  getParlorAppointments,
  updateAppointmentStatus,
  getAppointmentDetails,
  getActiveParlors,
  searchParlors,
} = require("../../controllers/shop/appointment-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Public parlor routes (for customers to browse)
router.get("/parlors", getActiveParlors);
router.get("/parlors/search", searchParlors);

// Customer appointment routes
router.post("/book", authMiddleware, createAppointment);
router.get("/customer/:customerId", authMiddleware, getCustomerAppointments);
router.get("/my-appointments", authMiddleware, getMyAppointments);
router.put("/cancel/:appointmentId", authMiddleware, cancelAppointment);

// Parlor owner appointment routes
router.get("/parlor-owner/:ownerId", authMiddleware, getParlorAppointments);
router.put(
  "/update-status/:appointmentId",
  authMiddleware,
  updateAppointmentStatus
);

// Shared routes
router.get("/details/:appointmentId", getAppointmentDetails);

module.exports = router;
