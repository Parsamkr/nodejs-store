const { default: mongoose, Types } = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    title: { type: String, unique: true },
    description: { type: String, default: "" },
    permissions: { type: [Types.ObjectId], ref: "permissions", default: [] },
  },
  { versionKey: false, toJSON: { virtuals: true } }
);

module.exports = { RoleModel: mongoose.model("role", RoleSchema) };
