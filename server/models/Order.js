const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed, // Allows both String and ObjectId
    required: true,
  },
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  // Khalti specific fields
  khaltiPidx: String,
  khaltiTransactionId: String,
  // Legacy PayPal fields (keep for backward compatibility)
  paymentId: String,
  payerId: String,
});

module.exports = mongoose.model("Order", OrderSchema);
