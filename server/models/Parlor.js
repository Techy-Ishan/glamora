const mongoose = require("mongoose");

const ParlorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    contact: {
      phone: { type: String, required: true },
      email: String,
      website: String,
    },
    images: [String], // Array of image URLs
    services: [
      {
        name: { type: String, required: true },
        description: String,
        duration: { type: Number, required: true }, // in minutes
        price: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for better performance
ParlorSchema.index({ ownerId: 1 });

module.exports = mongoose.model("Parlor", ParlorSchema);

// create a marketplace for parlor, admin should be able to create parlor, the owner of parlor should be able to change the contents of parlor like services offered etc.. normal user should be able to book appointments, parlor owner should be able to see all the booked appointments, and also able to change their status like confirmed not confirmed etc..     I will provide u a mongoose schema, use that as source of data, mock everything for now,  keep the ui/ux simple and elegant
