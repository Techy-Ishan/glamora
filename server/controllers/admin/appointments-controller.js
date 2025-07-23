const Appointment = require("../../models/Appointment");

const getAllAppointments = async (req, res) => {
  try {
    console.log("=== GET ALL APPOINTMENTS (ADMIN) ===");
    console.log("Admin user:", req.user);
    console.log("Request received at:", new Date().toISOString());

    // Check if user has admin role
    if (req.user.role !== "admin") {
      console.log("Access denied - user role:", req.user.role);
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required.",
      });
    }

    // First, let's count all appointments in the database
    const appointmentCount = await Appointment.countDocuments({});
    console.log("Total appointments in database:", appointmentCount);

    const appointments = await Appointment.find({})
      .populate("customerId", "userName email phone")
      .populate("parlorId", "name address contact")
      .sort({ _id: -1 }); // Sort by creation time (newest first)

    console.log("Found total appointments:", appointments.length);
    console.log(
      "Sample appointment:",
      appointments[0] ? appointments[0]._id : "No appointments"
    );

    if (appointments.length > 0) {
      console.log("First appointment details:", {
        id: appointments[0]._id,
        customerId: appointments[0].customerId,
        parlorId: appointments[0].parlorId,
        status: appointments[0].status,
        date: appointments[0].appointmentDate,
      });
    }

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log("Error fetching all appointments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
    });
  }
};

module.exports = {
  getAllAppointments,
};
