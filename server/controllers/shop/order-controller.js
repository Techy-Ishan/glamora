const {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
} = require("../../helpers/khalti");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;

    // Generate unique purchase order ID
    const purchaseOrderId = `ORDER_${Date.now()}_${userId}`;

    // Convert amount to paisa (Khalti expects amount in paisa)
    const amountInPaisa = Math.round(totalAmount * 100);

    // Prepare Khalti payment data
    const khaltiPaymentData = {
      return_url: `${
        process.env.CLIENT_URL || "http://localhost:5173"
      }/shop/khalti-return`,
      website_url: process.env.CLIENT_URL || "http://localhost:5173",
      amount: amountInPaisa,
      purchase_order_id: purchaseOrderId,
      purchase_order_name: `Glamora Order - ${cartItems.length} items`,
      customer_info: {
        name: addressInfo.address.split(",")[0] || "Customer", // Extract name from address
        email: "customer@glamora.com", // You might want to add email to user model
        phone: addressInfo.phone,
      },
      amount_breakdown: [
        {
          label: "Product Total",
          amount: amountInPaisa,
        },
      ],
      product_details: cartItems.map((item, index) => ({
        identity: item.productId,
        name: item.title,
        total_price: Math.round(item.price * item.quantity * 100),
        quantity: item.quantity,
        unit_price: Math.round(item.price * 100),
      })),
      merchant_username: "subashpoudyal43@gmail.com",
      merchant_extra: JSON.stringify({ orderId: purchaseOrderId }),
    };

    console.log(
      JSON.stringify(khaltiPaymentData, null, 2),
      "Khalti Payment Data"
    );

    try {
      // Initiate Khalti payment
      const khaltiResponse = await initiateKhaltiPayment(khaltiPaymentData);
      console.log(JSON.stringify(khaltiResponse, null, 2), "Khalti Response");

      // Create order in database
      const newlyCreatedOrder = new Order({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod: "khalti",
        paymentStatus,
        totalAmount,
        orderDate,
        orderUpdateDate,
        khaltiPidx: khaltiResponse.pidx,
        // Legacy fields for compatibility
        paymentId: "",
        payerId: "",
      });

      await newlyCreatedOrder.save();

      res.status(201).json({
        success: true,
        approvalURL: khaltiResponse.payment_url,
        orderId: newlyCreatedOrder._id,
        pidx: khaltiResponse.pidx,
      });
    } catch (khaltiError) {
      console.error("Khalti payment initiation error:", khaltiError);
      return res.status(500).json({
        success: false,
        message: "Error while creating Khalti payment",
        error: khaltiError,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { pidx, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order cannot be found",
      });
    }

    try {
      // Verify payment with Khalti
      const khaltiVerification = await verifyKhaltiPayment(pidx);

      if (khaltiVerification.status === "Completed") {
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.khaltiTransactionId = khaltiVerification.transaction_id;

        // Update product stock
        for (let item of order.cartItems) {
          let product = await Product.findById(item.productId);

          if (!product) {
            return res.status(404).json({
              success: false,
              message: `Not enough stock for this product ${item.title}`,
            });
          }

          product.totalStock -= item.quantity;
          await product.save();
        }

        // Delete cart
        const getCartId = order.cartId;
        await Cart.findByIdAndDelete(getCartId);

        await order.save();

        res.status(200).json({
          success: true,
          message: "Order confirmed",
          data: order,
        });
      } else {
        // Handle other statuses
        let orderStatus = "pending";
        let paymentStatus = "pending";

        switch (khaltiVerification.status) {
          case "Pending":
            orderStatus = "pending";
            paymentStatus = "pending";
            break;
          case "User canceled":
          case "Expired":
            orderStatus = "cancelled";
            paymentStatus = "failed";
            break;
          case "Refunded":
            orderStatus = "refunded";
            paymentStatus = "refunded";
            break;
          default:
            orderStatus = "pending";
            paymentStatus = "pending";
        }

        order.orderStatus = orderStatus;
        order.paymentStatus = paymentStatus;
        await order.save();

        res.status(400).json({
          success: false,
          message: `Payment ${khaltiVerification.status.toLowerCase()}`,
          data: order,
        });
      }
    } catch (khaltiError) {
      console.error("Khalti verification error:", khaltiError);
      return res.status(500).json({
        success: false,
        message: "Error verifying payment with Khalti",
        error: khaltiError,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
