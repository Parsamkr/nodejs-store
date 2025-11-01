#!/usr/bin/env node

const mongoose = require("mongoose");
require("dotenv").config();
const databaseSeeder = require("./app/utils/seedDatabase");

// Database connection
const DB_URI =
  process.env.DB_URI ||
  "mongodb://admin:password123@localhost:27017/StoreDB?authSource=admin";

async function connectToDatabase() {
  try {
    await mongoose.connect(DB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

async function main() {
  try {
    await connectToDatabase();

    console.log("🚀 Starting manual database seeding...\n");

    // Check current status
    const status = await databaseSeeder.checkSeedingStatus();
    console.log("\n📊 Current Database Status:");
    console.log(`  • Permissions: ${status.permissions ? "✅" : "❌"}`);
    console.log(`  • Roles: ${status.roles ? "✅" : "❌"}`);
    console.log(`  • Superadmin: ${status.superAdmin ? "✅" : "❌"}`);
    console.log(`  • Admin: ${status.admin ? "✅" : "❌"}`);
    console.log();

    // Run seeding
    await databaseSeeder.seedDatabase();

    console.log("\n🎉 Manual seeding completed!");
    console.log("\n🔗 Access URLs:");
    console.log("  • API Documentation: http://localhost:5000/api-doc");
    console.log("  • Mongo Express: http://localhost:8081");
    console.log("\n👤 Default Users:");
    console.log("  • Superadmin: 09116688000 / superadmin123");
    console.log("  • Admin: 09116688223 / admin123");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
    process.exit(0);
  }
}

// Run the script
main();
