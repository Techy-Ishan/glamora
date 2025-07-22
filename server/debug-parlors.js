const mongoose = require("mongoose");
const Parlor = require("./models/Parlor");
const User = require("./models/User");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log("MongoDB connected for debugging"))
  .catch((error) => console.log(error));

async function debugParlors() {
  try {
    console.log("=== DEBUGGING PARLORS ===");

    // Find all parlor owners
    const parlorOwners = await User.find({ role: "parlor_owner" });
    console.log(`Found ${parlorOwners.length} parlor owners:`);

    for (let owner of parlorOwners) {
      console.log(`- ${owner.userName} (${owner.email}) - ID: ${owner._id}`);

      // Check if this owner has a parlor
      const parlor = await Parlor.findOne({ ownerId: owner._id });
      if (parlor) {
        console.log(
          `  ✅ Has parlor: ${parlor.name} (${parlor.services.length} services)`
        );
      } else {
        console.log(`  ❌ No parlor found`);
      }
    }

    // Show all parlors
    const allParlors = await Parlor.find().populate(
      "ownerId",
      "userName email"
    );
    console.log(`\n=== ALL PARLORS (${allParlors.length}) ===`);

    for (let parlor of allParlors) {
      console.log(`- ${parlor.name}`);
      console.log(
        `  Owner: ${parlor.ownerId?.userName || "Unknown"} (${
          parlor.ownerId?._id
        })`
      );
      console.log(`  Services: ${parlor.services.length}`);
      console.log(`  Active: ${parlor.isActive}`);
    }
  } catch (error) {
    console.error("Debug error:", error);
  } finally {
    mongoose.disconnect();
  }
}

debugParlors();
