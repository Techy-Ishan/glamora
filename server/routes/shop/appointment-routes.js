const express = require("express");
const {
  createAppointment,
  getCustomerAppointments,
  cancelAppointment,
  getParlorAppointments,
  updateAppointmentStatus,
  getAppointmentDetails,
  getActiveParlors,
  searchParlors,
} = require("../../controllers/shop/appointment-controller");

const router = express.Router();

// Public parlor routes (for customers to browse)
router.get("/parlors", getActiveParlors);
router.get("/parlors/search", searchParlors);

// Customer appointment routes
router.post("/book", createAppointment);
router.get("/customer/:customerId", getCustomerAppointments);
router.put("/cancel/:appointmentId", cancelAppointment);

// Parlor owner appointment routes
router.get("/parlor-owner/:ownerId", getParlorAppointments);
router.put("/update-status/:appointmentId", updateAppointmentStatus);

// Shared routes
router.get("/details/:appointmentId", getAppointmentDetails);

module.exports = router;
