// This file has been removed - use manual data entry instead
// The parlor system is ready for manual testing through the admin panel
const demoParlors = [
  {
    name: "Glamour Studio",
    description:
      "Premier beauty destination offering comprehensive beauty services in a luxurious setting. Our experienced stylists provide personalized treatments for all your beauty needs.",
    address: "123 Beauty Street, Fashion District, Mumbai, Maharashtra 400001",
    phone: "+91 98765 43210",
    email: "info@glamourstudio.com",
    services: [
      {
        name: "Hair Cut & Styling",
        description: "Professional haircut with modern styling techniques",
        price: 800,
        duration: 60,
      },
      {
        name: "Hair Color & Highlights",
        description: "Full hair coloring service with premium products",
        price: 2500,
        duration: 180,
      },
      {
        name: "Facial Treatment",
        description: "Deep cleansing facial with anti-aging treatment",
        price: 1200,
        duration: 90,
      },
      {
        name: "Manicure & Pedicure",
        description: "Complete nail care with nail art options",
        price: 600,
        duration: 75,
      },
      {
        name: "Bridal Makeup",
        description: "Complete bridal makeover with HD makeup",
        price: 5000,
        duration: 180,
      },
    ],
    workingHours: {
      monday: { open: "09:00", close: "20:00", isOpen: true },
      tuesday: { open: "09:00", close: "20:00", isOpen: true },
      wednesday: { open: "09:00", close: "20:00", isOpen: true },
      thursday: { open: "09:00", close: "20:00", isOpen: true },
      friday: { open: "09:00", close: "20:00", isOpen: true },
      saturday: { open: "09:00", close: "21:00", isOpen: true },
      sunday: { open: "10:00", close: "18:00", isOpen: true },
    },
    rating: 4.8,
    reviewCount: 156,
    isActive: true,
  },
  {
    name: "Elite Beauty Lounge",
    description:
      "Sophisticated beauty lounge specializing in premium skincare and wellness treatments. Experience luxury beauty services in our serene environment.",
    address: "456 Wellness Avenue, Bandra West, Mumbai, Maharashtra 400050",
    phone: "+91 87654 32109",
    email: "contact@elitebeauty.com",
    services: [
      {
        name: "Deep Cleansing Facial",
        description: "Advanced facial treatment with deep pore cleansing",
        price: 1500,
        duration: 75,
      },
      {
        name: "Anti-Aging Treatment",
        description: "Professional anti-aging facial with collagen therapy",
        price: 3000,
        duration: 120,
      },
      {
        name: "Body Massage",
        description: "Full body relaxing massage with aromatherapy",
        price: 2000,
        duration: 90,
      },
      {
        name: "Hair Spa Treatment",
        description: "Nourishing hair spa with scalp massage",
        price: 1800,
        duration: 120,
      },
    ],
    workingHours: {
      monday: { open: "10:00", close: "19:00", isOpen: true },
      tuesday: { open: "10:00", close: "19:00", isOpen: true },
      wednesday: { open: "10:00", close: "19:00", isOpen: true },
      thursday: { open: "10:00", close: "19:00", isOpen: true },
      friday: { open: "10:00", close: "19:00", isOpen: true },
      saturday: { open: "09:00", close: "20:00", isOpen: true },
      sunday: { open: "10:00", close: "17:00", isOpen: true },
    },
    rating: 4.6,
    reviewCount: 89,
    isActive: true,
  },
  {
    name: "Urban Style Salon",
    description:
      "Trendy urban salon focusing on contemporary hairstyles and modern beauty treatments. Perfect for young professionals and style-conscious clients.",
    address: "789 Style Boulevard, Andheri East, Mumbai, Maharashtra 400069",
    phone: "+91 76543 21098",
    email: "hello@urbanstylesalon.com",
    services: [
      {
        name: "Trendy Haircut",
        description: "Modern haircut following latest fashion trends",
        price: 600,
        duration: 45,
      },
      {
        name: "Hair Straightening",
        description: "Professional hair straightening treatment",
        price: 3500,
        duration: 240,
      },
      {
        name: "Basic Facial",
        description: "Quick refreshing facial for busy lifestyles",
        price: 800,
        duration: 60,
      },
      {
        name: "Beard Grooming",
        description: "Professional beard trimming and styling",
        price: 400,
        duration: 30,
      },
    ],
    workingHours: {
      monday: { open: "11:00", close: "21:00", isOpen: true },
      tuesday: { open: "11:00", close: "21:00", isOpen: true },
      wednesday: { open: "11:00", close: "21:00", isOpen: true },
      thursday: { open: "11:00", close: "21:00", isOpen: true },
      friday: { open: "11:00", close: "21:00", isOpen: true },
      saturday: { open: "10:00", close: "22:00", isOpen: true },
      sunday: { open: "11:00", close: "20:00", isOpen: true },
    },
    rating: 4.4,
    reviewCount: 234,
    isActive: true,
  },
];

async function seedParlors() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/glamora", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Clear existing parlor data
    await Parlor.deleteMany({});
    console.log("Cleared existing parlor data");

    // Create demo parlors
    const createdParlors = await Parlor.insertMany(demoParlors);

    console.log(`Created ${createdParlors.length} demo parlors successfully!`);

    console.log("\nDemo Parlors Created:");
    createdParlors.forEach((parlor, index) => {
      console.log(`${index + 1}. ${parlor.name}`);
      console.log(`   Address: ${parlor.address}`);
      console.log(`   Services: ${parlor.services.length} services available`);
      console.log(
        `   Rating: ${parlor.rating}/5 (${parlor.reviewCount} reviews)`
      );
      console.log("");
    });

    console.log("You can now test the parlor system by:");
    console.log("1. Starting the server: npm start");
    console.log("2. Starting the client: cd ../client && npm run dev");
    console.log("3. Visiting http://localhost:5173/shop/parlors");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding parlor data:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedParlors();
