const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Import models
const { RoleModel } = require("../models/role");
const { PermissionModel } = require("../models/permission");
const { UserModel } = require("../models/users");

class DatabaseSeeder {
  constructor() {
    this.isSeeded = false;
  }

  async seedPermissions() {
    console.log("🌱 Seeding permissions...");

    const permissions = [
      // User permissions
      { name: "profile", description: "Manage user profile" },

      // Admin permissions
      { name: "all", description: "Full system access" },

      // Content management permissions
      { name: "course", description: "Manage courses" },
      { name: "blog", description: "Manage blog posts" },
      { name: "category", description: "Manage categories" },
      { name: "product", description: "Manage products" },

      // User management permissions
      { name: "user", description: "Manage users" },
      { name: "role", description: "Manage roles" },
      { name: "permission", description: "Manage permissions" },

      // Content specific permissions
      { name: "chapter", description: "Manage course chapters" },
      { name: "episode", description: "Manage course episodes" },

      // System permissions
      { name: "dashboard", description: "Access admin dashboard" },
      { name: "analytics", description: "View analytics and reports" },
    ];

    for (const permission of permissions) {
      try {
        await PermissionModel.findOneAndUpdate(
          { name: permission.name },
          permission,
          { upsert: true, new: true }
        );
      } catch (error) {
        console.error(
          `Failed to create permission ${permission.name}:`,
          error.message
        );
      }
    }

    console.log("✅ Permissions seeded successfully");
  }

  async seedRoles() {
    console.log("🌱 Seeding roles...");

    // Get all permissions first
    const allPermissions = await PermissionModel.find({});
    const permissionMap = {};
    allPermissions.forEach((perm) => {
      permissionMap[perm.name] = perm._id;
    });

    const roles = [
      {
        title: "SUPERADMIN",
        description: "Full system access with all permissions",
        permissions: [permissionMap.all],
      },
      {
        title: "ADMIN",
        description: "Administrative access to most system features",
        permissions: [
          permissionMap.user,
          permissionMap.role,
          permissionMap.permission,
          permissionMap.dashboard,
          permissionMap.analytics,
          permissionMap.course,
          permissionMap.blog,
          permissionMap.category,
          permissionMap.product,
          permissionMap.chapter,
          permissionMap.episode,
        ],
      },
      {
        title: "CONTENT_MANAGER",
        description:
          "Manage content including courses, blogs, categories, and products",
        permissions: [
          permissionMap.course,
          permissionMap.blog,
          permissionMap.category,
          permissionMap.product,
          permissionMap.chapter,
          permissionMap.episode,
          permissionMap.dashboard,
        ],
      },
      {
        title: "TEACHER",
        description: "Create and manage courses and blog content",
        permissions: [
          permissionMap.course,
          permissionMap.blog,
          permissionMap.chapter,
          permissionMap.episode,
          permissionMap.dashboard,
        ],
      },
      {
        title: "SUPPLIER",
        description: "Manage products and inventory",
        permissions: [permissionMap.product, permissionMap.dashboard],
      },
      {
        title: "USER",
        description: "Basic user access",
        permissions: [permissionMap.profile],
      },
    ];

    for (const role of roles) {
      try {
        await RoleModel.findOneAndUpdate({ title: role.title }, role, {
          upsert: true,
          new: true,
        });
      } catch (error) {
        console.error(`Failed to create role ${role.title}:`, error.message);
      }
    }

    console.log("✅ Roles seeded successfully");
  }

  async createSuperAdmin() {
    console.log("🌱 Creating superadmin user...");

    try {
      // Check if superadmin already exists
      const existingSuperAdmin = await UserModel.findOne({
        $or: [
          { mobile: "09116688000" },
          { email: "superadmin@parsastore.com" },
          { username: "superadmin" },
        ],
      });

      if (existingSuperAdmin) {
        console.log("ℹ️  Superadmin user already exists");
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash("superadmin123", 10);

      // Create superadmin user
      const superAdmin = await UserModel.create({
        first_name: "Super",
        last_name: "Admin",
        username: "superadmin",
        mobile: "09116688000",
        email: "superadmin@parsastore.com",
        password: hashedPassword,
        role: "SUPERADMIN",
        otp: { code: 0, expiresIn: 0 },
      });

      console.log("✅ Superadmin user created successfully");
      console.log("   📱 Mobile: 09116688000");
      console.log("   📧 Email: superadmin@parsastore.com");
      console.log("   👤 Username: superadmin");
      console.log("   🔑 Password: superadmin123");
    } catch (error) {
      console.error("Failed to create superadmin user:", error.message);
    }
  }

  async createAdmin() {
    console.log("🌱 Creating admin user...");

    try {
      // Check if admin already exists
      const existingAdmin = await UserModel.findOne({
        $or: [
          { mobile: "09116688223" },
          { email: "admin@parsastore.com" },
          { username: "admin" },
        ],
      });

      if (existingAdmin) {
        console.log("ℹ️  Admin user already exists");
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash("admin123", 10);

      // Create admin user
      const admin = await UserModel.create({
        first_name: "Admin",
        last_name: "User",
        username: "admin",
        mobile: "09116688223",
        email: "admin@parsastore.com",
        password: hashedPassword,
        role: "ADMIN",
        otp: { code: 0, expiresIn: 0 },
      });

      console.log("✅ Admin user created successfully");
      console.log("   📱 Mobile: 09116688223");
      console.log("   📧 Email: admin@parsastore.com");
      console.log("   👤 Username: admin");
      console.log("   🔑 Password: admin123");
    } catch (error) {
      console.error("Failed to create admin user:", error.message);
    }
  }

  async seedDatabase() {
    if (this.isSeeded) {
      console.log("ℹ️  Database already seeded, skipping...");
      return;
    }

    try {
      console.log("🚀 Starting database seeding...\n");

      await this.seedPermissions();
      console.log();

      await this.seedRoles();
      console.log();

      await this.createSuperAdmin();
      console.log();

      await this.createAdmin();
      console.log();

      this.isSeeded = true;
      console.log("🎉 Database seeding completed successfully!");
      console.log("\n📋 Summary:");
      console.log("  • Permissions: Created/Updated");
      console.log("  • Roles: Created/Updated");
      console.log("  • Superadmin: Created/Verified");
      console.log("  • Admin: Created/Verified");
    } catch (error) {
      console.error("❌ Database seeding failed:", error.message);
    }
  }

  async checkSeedingStatus() {
    try {
      const permissionCount = await PermissionModel.countDocuments();
      const roleCount = await RoleModel.countDocuments();
      const superAdminCount = await UserModel.countDocuments({
        role: "SUPERADMIN",
      });
      const adminCount = await UserModel.countDocuments({ role: "ADMIN" });

      console.log("📊 Database Status:");
      console.log(`  • Permissions: ${permissionCount}`);
      console.log(`  • Roles: ${roleCount}`);
      console.log(`  • Superadmins: ${superAdminCount}`);
      console.log(`  • Admins: ${adminCount}`);

      return {
        permissions: permissionCount > 0,
        roles: roleCount > 0,
        superAdmin: superAdminCount > 0,
        admin: adminCount > 0,
      };
    } catch (error) {
      console.error("Failed to check seeding status:", error.message);
      return {
        permissions: false,
        roles: false,
        superAdmin: false,
        admin: false,
      };
    }
  }
}

module.exports = new DatabaseSeeder();
