const Appointment = require("../../models/Appointment");
const Parlor = require("../../models/Parlor");

// Customer Controllers
const createAppointment = async (req, res) => {
  try {
    console.log("=== CREATE APPOINTMENT ===");
    console.log("Request body:", req.body);
    console.log("Authenticated user:", req.user);

    const {
      parlorId,
      customerId,
      services,
      appointmentDate,
      appointmentTime,
      customerNotes,
    } = req.body;

    // Verify parlor exists
    const parlor = await Parlor.findById(parlorId);
    if (!parlor) {
      return res.status(404).json({
        success: false,
        message: "Parlor not found",
      });
    }

    // Calculate total duration and amount
    let totalDuration = 0;
    let totalAmount = 0;

    const processedServices = services.map((service) => {
      totalDuration += service.duration;
      totalAmount += service.price;
      return {
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        duration: service.duration,
        price: service.price,
      };
    });

    console.log("Processed services:", processedServices);
    console.log("Total duration:", totalDuration, "minutes");
    console.log("Total amount:", totalAmount);

    const newAppointment = new Appointment({
      parlorId,
      customerId,
      services: processedServices,
      appointmentDate,
      appointmentTime,
      totalDuration,
      totalAmount,
      customerNotes: customerNotes || "",
      status: "pending",
      paymentStatus: "pending",
    });

    await newAppointment.save();
    console.log("Appointment saved with ID:", newAppointment._id);

    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate("parlorId", "name address contact")
      .populate("customerId", "userName email phone");

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: populatedAppointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating appointment",
    });
  }
};

const getCustomerAppointments = async (req, res) => {
  try {
    const { customerId } = req.params;
    console.log("=== GET CUSTOMER APPOINTMENTS ===");
    console.log("Customer ID from params:", customerId);
    console.log("Authenticated user:", req.user);

    // Use the customerId from params if provided, otherwise use authenticated user ID
    const userId = customerId || req.user.id;

    const appointments = await Appointment.find({ customerId: userId })
      .populate("parlorId", "name address contact images")
      .sort({ appointmentDate: -1 });

    console.log("Found appointments:", appointments.length);
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log("Error fetching customer appointments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
    });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    console.log("=== GET MY APPOINTMENTS ===");
    console.log("Authenticated user:", req.user);
    console.log("User ID:", req.user?.id);
    console.log("Request received at:", new Date().toISOString());

    // Count all appointments in database
    const totalCount = await Appointment.countDocuments({});
    console.log("Total appointments in database:", totalCount);

    // Count appointments for this user
    const userCount = await Appointment.countDocuments({
      customerId: req.user.id,
    });
    console.log("Appointments for user", req.user.id, ":", userCount);

    const appointments = await Appointment.find({ customerId: req.user.id })
      .populate("parlorId", "name address contact images")
      .sort({ appointmentDate: -1 });

    console.log("Found my appointments:", appointments.length);
    console.log(
      "Sample appointment:",
      appointments[0] ? appointments[0]._id : "No appointments for this user"
    );

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log("Error fetching my appointments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { customerId } = req.body;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      customerId: customerId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed appointment",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error cancelling appointment",
    });
  }
};

// Parlor Owner Controllers
const getParlorAppointments = async (req, res) => {
  try {
    const { ownerId } = req.params;
    console.log("=== GET PARLOR APPOINTMENTS ===");
    console.log("Owner ID:", ownerId);
    console.log("Authenticated user:", req.user);

    // First find the parlor owned by this user
    const parlor = await Parlor.findOne({ ownerId });
    if (!parlor) {
      console.log("No parlor found for owner:", ownerId);
      return res.status(404).json({
        success: false,
        message: "No parlor found for this owner",
      });
    }

    console.log("Found parlor:", parlor.name, "ID:", parlor._id);

    const appointments = await Appointment.find({ parlorId: parlor._id })
      .populate("customerId", "userName email phone")
      .sort({ appointmentDate: -1 });

    console.log("Found appointments for parlor:", appointments.length);
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log("Error fetching parlor appointments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, parlorNotes, ownerId } = req.body;

    // Verify the parlor owner has permission to update this appointment
    const parlor = await Parlor.findOne({ ownerId });
    if (!parlor) {
      return res.status(404).json({
        success: false,
        message: "No parlor found for this owner",
      });
    }

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      parlorId: parlor._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = status;
    if (parlorNotes) {
      appointment.parlorNotes = parlorNotes;
    }

    await appointment.save();

    const updatedAppointment = await Appointment.findById(
      appointmentId
    ).populate("customerId", "userName email phone");

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating appointment status",
    });
  }
};

const getAppointmentDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate("parlorId", "name address contact")
      .populate("customerId", "userName email phone");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointment details",
    });
  }
};

// Public Controllers (for customers to browse)
const getActiveParlors = async (req, res) => {
  try {
    const parlors = await Parlor.find({ isActive: true })
      .populate("ownerId", "userName")
      .select("name description address contact images services")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: parlors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching parlors",
    });
  }
};

const searchParlors = async (req, res) => {
  try {
    const { city, service } = req.query;
    let query = { isActive: true };

    if (city) {
      query["address.city"] = new RegExp(city, "i");
    }

    if (service) {
      query["services.name"] = new RegExp(service, "i");
    }

    const parlors = await Parlor.find(query)
      .populate("ownerId", "userName")
      .select("name description address contact images services")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: parlors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error searching parlors",
    });
  }
};

module.exports = {
  // Customer controllers
  createAppointment,
  getCustomerAppointments,
  getMyAppointments,
  cancelAppointment,

  // Parlor owner controllers
  getParlorAppointments,
  updateAppointmentStatus,

  // Shared controllers
  getAppointmentDetails,
  getActiveParlors,
  searchParlors,
};
