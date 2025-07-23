const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    parlorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parlor",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    services: [
      {
        serviceId: { type: String, required: true }, // Reference to service in parlor.services array
        serviceName: { type: String, required: true },
        duration: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true, // Format: "14:30"
    },
    totalDuration: {
      type: Number,
      required: true, // Total duration in minutes
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    cancelledBy: {
      type: String,
      enum: ["customer", "parlor"],
      default: null,
    },
    statusUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    customerNotes: String,
    parlorNotes: String,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    paymentMethod: String,
    paymentId: String,
  },
  { timestamps: true }
);

// Indexes
AppointmentSchema.index({ parlorId: 1, appointmentDate: 1 });
AppointmentSchema.index({ customerId: 1 });
AppointmentSchema.index({ status: 1 });

module.exports = mongoose.model("Appointment", AppointmentSchema);
