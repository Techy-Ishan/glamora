const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const Appointment = require("./models/Appointment");
const User = require("./models/User");
const Parlor = require("./models/Parlor");

async function createSampleAppointment() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB);
    console.log("Connected to MongoDB");

    // Find any existing user and parlor
    const user = await User.findOne({ role: "user" });
    const parlor = await Parlor.findOne();

    if (!user) {
      console.log("No user found. Please create a user first.");
      return;
    }

    if (!parlor) {
      console.log("No parlor found. Please create a parlor first.");
      return;
    }

    console.log("Found user:", user.userName, "ID:", user._id);
    console.log("Found parlor:", parlor.name, "ID:", parlor._id);

    // Create a sample appointment
    const sampleAppointment = new Appointment({
      parlorId: parlor._id,
      customerId: user._id,
      services: [
        {
          serviceId: "1",
          serviceName: "Haircut",
          duration: 30,
          price: 500,
        },
        {
          serviceId: "2",
          serviceName: "Hair Wash",
          duration: 15,
          price: 200,
        },
      ],
      appointmentDate: new Date("2025-07-25"),
      appointmentTime: "14:30",
      totalDuration: 45,
      totalAmount: 700,
      customerNotes: "Please use organic products",
      status: "pending",
      paymentStatus: "pending",
    });

    await sampleAppointment.save();
    console.log("Sample appointment created with ID:", sampleAppointment._id);

    // Verify it was saved
    const savedAppointment = await Appointment.findById(sampleAppointment._id)
      .populate("customerId", "userName email")
      .populate("parlorId", "name address");

    console.log("Verified appointment:", {
      id: savedAppointment._id,
      customer: savedAppointment.customerId.userName,
      parlor: savedAppointment.parlorId.name,
      services: savedAppointment.services.length,
      date: savedAppointment.appointmentDate,
      time: savedAppointment.appointmentTime,
      status: savedAppointment.status,
    });

    process.exit(0);
  } catch (error) {
    console.error("Error creating sample appointment:", error);
    process.exit(1);
  }
}

createSampleAppointment();
