const Appointment = require("../../models/Appointment");

const getAllAppointments = async (req, res) => {
  try {
    console.log("=== GET ALL APPOINTMENTS (ADMIN) ===");
    console.log("Admin user:", req.user);
    console.log("Request received at:", new Date().toISOString());

    // First, let's count all appointments in the database
    const appointmentCount = await Appointment.countDocuments({});
    console.log("Total appointments in database:", appointmentCount);

    const appointments = await Appointment.find({})
      .populate("customerId", "userName email phone")
      .populate("parlorId", "name address contact")
      .sort({ appointmentDate: -1, appointmentTime: -1 });

    console.log("Found total appointments:", appointments.length);
    console.log(
      "Sample appointment:",
      appointments[0] ? appointments[0]._id : "No appointments"
    );

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
