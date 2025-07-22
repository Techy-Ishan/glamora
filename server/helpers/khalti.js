const axios = require("axios");

const KHALTI_SECRET_KEY =
  process.env.KHALTI_SECRET_KEY || "05bf95cc57244045b8df5fad06748dab"; // Sandbox key
const KHALTI_BASE_URL =
  process.env.KHALTI_BASE_URL || "https://dev.khalti.com/api/v2";

const khaltiConfig = {
  headers: {
    Authorization: `Key ${KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
};

const initiateKhaltiPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/initiate/`,
      paymentData,
      khaltiConfig
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const verifyKhaltiPayment = async (pidx) => {
  try {
    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/lookup/`,
      { pidx },
      khaltiConfig
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

module.exports = {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
  KHALTI_SECRET_KEY,
};
