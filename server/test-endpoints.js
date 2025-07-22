const axios = require("axios");

async function testEndpoints() {
  try {
    console.log("Testing API endpoints...");

    // Test admin appointments endpoint (without auth for now)
    console.log("\n=== Testing Admin Appointments ===");
    try {
      const adminResponse = await axios.get(
        "http://localhost:5000/api/admin/appointments/all"
      );
      console.log("Admin endpoint status:", adminResponse.status);
      console.log("Admin appointments found:", adminResponse.data.data.length);
    } catch (error) {
      console.log(
        "Admin endpoint error:",
        error.response?.status,
        error.response?.data?.message
      );
    }

    // Test customer appointments endpoint (without auth for now)
    console.log("\n=== Testing Customer Appointments ===");
    try {
      const customerResponse = await axios.get(
        "http://localhost:5000/api/shop/appointments/my-appointments"
      );
      console.log("Customer endpoint status:", customerResponse.status);
      console.log(
        "Customer appointments found:",
        customerResponse.data.data.length
      );
    } catch (error) {
      console.log(
        "Customer endpoint error:",
        error.response?.status,
        error.response?.data?.message
      );
    }
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

testEndpoints();
