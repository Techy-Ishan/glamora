const Parlor = require("../../models/Parlor");
const User = require("../../models/User");
const Appointment = require("../../models/Appointment");

// Admin Controllers
const createParlor = async (req, res) => {
  try {
    console.log("Create parlor request received:", req.body);

    const { name, description, ownerId, address, contact, images, services } =
      req.body;

    console.log("Extracted data:", {
      name,
      description,
      ownerId,
      address,
      contact,
      images,
      services,
    });

    // Verify the owner exists and update their role
    const owner = await User.findById(ownerId);
    if (!owner) {
      console.log("Owner not found for ID:", ownerId);
      return res.status(404).json({
        success: false,
        message: "Selected user not found",
      });
    }

    console.log("Owner found:", owner.userName);

    // Update user role to parlor_owner
    owner.role = "parlor_owner";
    await owner.save();

    console.log("Creating parlor with data:", {
      name,
      description,
      ownerId,
      address,
      contact,
      images: images || [],
      services: services || [],
    });

    // Create the parlor
    const newParlor = new Parlor({
      name,
      description,
      ownerId,
      address,
      contact,
      images: images || [],
      services: services || [],
    });

    console.log("Saving parlor...");
    await newParlor.save();
    console.log("Parlor saved successfully:", newParlor._id);

    res.status(201).json({
      success: true,
      message: "Parlor created successfully",
      data: newParlor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating parlor",
    });
  }
};

const getAllParlors = async (req, res) => {
  try {
    const parlors = await Parlor.find({})
      .populate("ownerId", "userName email phone")
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

const getParlorById = async (req, res) => {
  try {
    const { id } = req.params;
    const parlor = await Parlor.findById(id).populate(
      "ownerId",
      "userName email phone"
    );

    if (!parlor) {
      return res.status(404).json({
        success: false,
        message: "Parlor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: parlor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching parlor details",
    });
  }
};

const updateParlor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const parlor = await Parlor.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("ownerId", "userName email phone");

    if (!parlor) {
      return res.status(404).json({
        success: false,
        message: "Parlor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parlor updated successfully",
      data: parlor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating parlor",
    });
  }
};

const deleteParlor = async (req, res) => {
  try {
    const { id } = req.params;

    const parlor = await Parlor.findById(id);
    if (!parlor) {
      return res.status(404).json({
        success: false,
        message: "Parlor not found",
      });
    }

    // Optionally, revert owner role back to 'user'
    await User.findByIdAndUpdate(parlor.ownerId, { role: "user" });

    await Parlor.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Parlor deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error deleting parlor",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["user", "parlor_owner"] } })
      .select("userName email phone role")
      .sort({ userName: 1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};

// Parlor Owner Controllers
const getMyParlor = async (req, res) => {
  try {
    const { ownerId } = req.params;

    console.log("Fetching parlor for owner:", ownerId);

    const parlor = await Parlor.findOne({ ownerId });

    if (!parlor) {
      return res.status(404).json({
        success: false,
        message: "Parlor not found for this owner",
      });
    }

    console.log(
      "Parlor found:",
      parlor.name,
      "Services:",
      parlor.services?.length || 0
    );

    res.status(200).json({
      success: true,
      data: parlor,
    });
  } catch (error) {
    console.error("Error fetching my parlor:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching parlor data",
    });
  }
};

const updateMyParlor = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const updateData = req.body;

    const parlor = await Parlor.findOneAndUpdate({ ownerId }, updateData, {
      new: true,
    });

    if (!parlor) {
      return res.status(404).json({
        success: false,
        message: "No parlor found for this owner",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parlor updated successfully",
      data: parlor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating parlor",
    });
  }
};

const addService = async (req, res) => {
  try {
    const { parlorId } = req.params;
    const { name, description, duration, price } = req.body;

    console.log("Adding service to parlor:", parlorId, req.body);

    if (!name || !description || !duration || !price) {
      return res.status(400).json({
        success: false,
        message: "All service fields are required",
      });
    }

    const parlor = await Parlor.findById(parlorId);
    if (!parlor) {
      return res.status(404).json({
        success: false,
        message: "Parlor not found",
      });
    }

    const newService = {
      name,
      description,
      duration: parseInt(duration),
      price: parseFloat(price),
    };

    parlor.services.push(newService);
    await parlor.save();

    console.log("Service added successfully");

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      data: parlor,
    });
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({
      success: false,
      message: "Error adding service",
    });
  }
};

const updateService = async (req, res) => {
  try {
    const { parlorId, serviceId } = req.params;
    const { name, description, duration, price } = req.body;

    console.log("Updating service:", serviceId, "in parlor:", parlorId);

    const parlor = await Parlor.findById(parlorId);
    if (!parlor) {
      return res.status(404).json({
        success: false,
        message: "Parlor not found",
      });
    }

    const serviceIndex = parlor.services.findIndex(
      (service) => service._id.toString() === serviceId
    );

    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    parlor.services[serviceIndex] = {
      ...parlor.services[serviceIndex],
      name: name || parlor.services[serviceIndex].name,
      description: description || parlor.services[serviceIndex].description,
      duration: duration
        ? parseInt(duration)
        : parlor.services[serviceIndex].duration,
      price: price ? parseFloat(price) : parlor.services[serviceIndex].price,
    };

    await parlor.save();

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: parlor,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({
      success: false,
      message: "Error updating service",
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const { parlorId, serviceId } = req.params;

    console.log("Deleting service:", serviceId, "from parlor:", parlorId);

    const parlor = await Parlor.findById(parlorId);
    if (!parlor) {
      return res.status(404).json({
        success: false,
        message: "Parlor not found",
      });
    }

    parlor.services = parlor.services.filter(
      (service) => service._id.toString() !== serviceId
    );

    await parlor.save();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: parlor,
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting service",
    });
  }
};

// Update parlor images
const updateParlorImages = async (req, res) => {
  try {
    const { parlorId } = req.params;
    const { images } = req.body;

    console.log("Updating images for parlor:", parlorId);

    const parlor = await Parlor.findById(parlorId);
    if (!parlor) {
      return res.status(404).json({
        success: false,
        message: "Parlor not found",
      });
    }

    parlor.images = images;
    await parlor.save();

    res.status(200).json({
      success: true,
      message: "Images updated successfully",
      data: parlor,
    });
  } catch (error) {
    console.error("Error updating images:", error);
    res.status(500).json({
      success: false,
      message: "Error updating images",
    });
  }
};

module.exports = {
  // Admin controllers
  createParlor,
  getAllParlors,
  getParlorById,
  updateParlor,
  deleteParlor,
  getAllUsers,

  // Parlor owner controllers
  getMyParlor,
  updateMyParlor,
  addService,
  updateService,
  deleteService,
  updateParlorImages,
};
