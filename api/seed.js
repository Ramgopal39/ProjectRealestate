import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/user_model.js";
import Listing from "./models/listing_model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO;

if (!MONGO_URI) {
  console.error("MONGO URI is not defined in .env");
  process.exit(1);
}

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Find the first user or create a default one
    let user = await User.findOne({});
    if (!user) {
      user = await User.create({
        username: "testuser123",
        email: "testuser123@example.com",
        password: "password123", // raw password for mock user
      });
      console.log("Created a default test user:", user.username);
    } else {
      console.log("Found existing user to associate listings with:", user.username);
    }

    const userId = user._id.toString();

    // Listings to seed
    const mockListings = [
      {
        name: "Modern Luxury Villa with Infinity Pool",
        description: "Experience the epitome of modern living in this stunning 4-bedroom villa. Featuring double-height ceilings, a state-of-the-art chef's kitchen, custom smart-home automation, and a breathtaking infinity pool overlooking the valley. Fully furnished with high-end designer pieces and featuring a spacious 3-car garage.",
        address: "742 Evergreen Terrace, Beverly Hills, CA 90210",
        contactNumber: "9876543210",
        regularPrice: 8500,
        discountPrice: 7900,
        bedrooms: 4,
        bathrooms: 4,
        furnished: true,
        parking: true,
        type: "rent",
        offer: true,
        imageUrls: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        ],
        userRef: userId
      },
      {
        name: "Charming Suburb Family Home",
        description: "A gorgeous, cozy family home nestled in a quiet, tree-lined suburban neighborhood. Features a spacious landscaped backyard perfect for children and pets, an open-concept living area, and a warm, inviting fireplace. Close to top-rated schools, parks, and local shopping centers.",
        address: "104 Maple Court, Naperville, IL 60540",
        contactNumber: "9876543211",
        regularPrice: 420000,
        discountPrice: 395000,
        bedrooms: 3,
        bathrooms: 2,
        furnished: false,
        parking: true,
        type: "sale",
        offer: true,
        imageUrls: [
          "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1200&q=80"
        ],
        userRef: userId
      },
      {
        name: "Contemporary Smart Penthouse",
        description: "Stunning top-floor penthouse apartment with panoramic city skyline views. Equipped with floor-to-ceiling glass windows, automated smart blinds, integrated multi-room sound systems, and a private rooftop terrace. Exclusive access to the building's indoor heated pool, fitness center, and 24/7 concierge service.",
        address: "505 Fifth Avenue, Penthouse B, New York, NY 10017",
        contactNumber: "9876543212",
        regularPrice: 12000,
        discountPrice: 0,
        bedrooms: 2,
        bathrooms: 2.5,
        furnished: true,
        parking: true,
        type: "rent",
        offer: false,
        imageUrls: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
        ],
        userRef: userId
      },
      {
        name: "Rustic Lakefront A-Frame Cabin",
        description: "Escape to nature in this beautiful, modern A-frame cabin situated directly on the shore of Lake Tahoe. Offers private dock access, a massive wrap-around deck, an outdoor wood-fired hot tub, and a loft bedroom with a skylight for stargazing. Excellent rental history as a vacation home.",
        address: "2417 Emerald Bay Road, South Lake Tahoe, CA 96150",
        contactNumber: "9876543213",
        regularPrice: 580000,
        discountPrice: 0,
        bedrooms: 2,
        bathrooms: 1,
        furnished: true,
        parking: false,
        type: "sale",
        offer: false,
        imageUrls: [
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
        ],
        userRef: userId
      },
      {
        name: "Minimalist Modern Townhouse",
        description: "A beautifully designed minimalist townhouse highlighting clean lines, industrial accents, and high-efficiency features. Contains a private rear courtyard, premium stainless-steel appliances, concrete flooring, and low-maintenance native landscaping. Perfect for young professionals.",
        address: "889 W Peachtree St NW, Atlanta, GA 30309",
        contactNumber: "9876543214",
        regularPrice: 3200,
        discountPrice: 2990,
        bedrooms: 2,
        bathrooms: 2,
        furnished: false,
        parking: true,
        type: "rent",
        offer: true,
        imageUrls: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
        ],
        userRef: userId
      }
    ];

    console.log("Deleting old listings...");
    await Listing.deleteMany({ userRef: userId });

    console.log("Seeding new mock listings...");
    const createdListings = await Listing.insertMany(mockListings);
    console.log(`Successfully seeded ${createdListings.length} listings!`);

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  }
};

seedData();
