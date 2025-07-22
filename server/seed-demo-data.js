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
      {
        name: "Eyebrow Threading",
        description: "Precise eyebrow shaping and threading",
        price: 200,
        duration: 20,
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
      {
        name: "Gel Nail Extension",
        description: "Professional gel nail extensions with designs",
        price: 1200,
        duration: 90,
      },
      {
        name: "Makeup & Hair Styling",
        description: "Party makeup with professional hair styling",
        price: 2500,
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
      {
        name: "Hair Wash & Blow Dry",
        description: "Professional hair wash with styling",
        price: 300,
        duration: 30,
      },
      {
        name: "Quick Makeup",
        description: "Express makeup for office or casual events",
        price: 800,
        duration: 45,
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
  {
    name: "Royal Beauty Palace",
    description:
      "Luxury beauty palace offering royal treatment experiences. Specializing in traditional and modern beauty services with premium products and expert staff.",
    address: "321 Palace Road, Juhu, Mumbai, Maharashtra 400049",
    phone: "+91 98765 12345",
    email: "royal@beautypalace.com",
    services: [
      {
        name: "Royal Facial Treatment",
        description: "Luxury facial with gold therapy and premium products",
        price: 4000,
        duration: 150,
      },
      {
        name: "Bridal Package",
        description: "Complete bridal makeover with pre-wedding treatments",
        price: 15000,
        duration: 300,
      },
      {
        name: "Hair Keratin Treatment",
        description: "Professional keratin treatment for smooth hair",
        price: 5000,
        duration: 180,
      },
      {
        name: "Full Body Spa",
        description: "Complete body spa with multiple therapy sessions",
        price: 6000,
        duration: 240,
      },
      {
        name: "Luxury Manicure",
        description: "Premium manicure with organic products",
        price: 1500,
        duration: 60,
      },
      {
        name: "Professional Photoshoot Makeup",
        description: "High-definition makeup for professional photography",
        price: 8000,
        duration: 180,
      },
    ],
    workingHours: {
      monday: { open: "09:00", close: "19:00", isOpen: true },
      tuesday: { open: "09:00", close: "19:00", isOpen: true },
      wednesday: { open: "09:00", close: "19:00", isOpen: true },
      thursday: { open: "09:00", close: "19:00", isOpen: true },
      friday: { open: "09:00", close: "19:00", isOpen: true },
      saturday: { open: "08:00", close: "20:00", isOpen: true },
      sunday: { open: "09:00", close: "18:00", isOpen: true },
    },
    rating: 4.9,
    reviewCount: 78,
    isActive: true,
  },
];

// Demo parlor owners
const demoUsers = [
  {
    userName: "Priya Sharma",
    email: "priya.glamour@gmail.com",
    password: "password123",
    role: "parlor_owner",
  },
  {
    userName: "Rakesh Mehta",
    email: "rakesh.elite@gmail.com",
    password: "password123",
    role: "parlor_owner",
  },
  {
    userName: "Sneha Patel",
    email: "sneha.urban@gmail.com",
    password: "password123",
    role: "parlor_owner",
  },
  {
    userName: "Arjun Singh",
    email: "arjun.royal@gmail.com",
    password: "password123",
    role: "parlor_owner",
  },
];

async function seedDemoData() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/glamora", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Clear existing data
    await Parlor.deleteMany({});
    console.log("Cleared existing parlor data");

    // Create demo users (parlor owners)
    const createdUsers = [];
    for (let i = 0; i < demoUsers.length; i++) {
      const userData = demoUsers[i];

      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const newUser = new User({
          ...userData,
          password: hashedPassword,
        });
        const savedUser = await newUser.save();
        createdUsers.push(savedUser);
        console.log(`Created parlor owner: ${userData.userName}`);
      } else {
        // Update existing user to parlor_owner role
        existingUser.role = "parlor_owner";
        await existingUser.save();
        createdUsers.push(existingUser);
        console.log(
          `Updated existing user to parlor owner: ${userData.userName}`
        );
      }
    }

    // Create demo parlors and assign owners
    for (let i = 0; i < demoParlors.length; i++) {
      const parlorData = demoParlors[i];
      const ownerId = createdUsers[i] ? createdUsers[i]._id : null;

      const newParlor = new Parlor({
        ...parlorData,
        ownerId: ownerId,
      });

      await newParlor.save();
      console.log(`Created parlor: ${parlorData.name}`);
    }

    console.log("Demo data seeded successfully!");
    console.log("\nDemo Parlor Owners Created:");
    createdUsers.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.userName} (${user.email}) - Password: password123`
      );
    });

    console.log("\nDemo Parlors Created:");
    demoParlors.forEach((parlor, index) => {
      console.log(`${index + 1}. ${parlor.name} - ${parlor.address}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding demo data:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedDemoData();
