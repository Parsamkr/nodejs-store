const { default: mongoose, Types } = require("mongoose");

const PermissionSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    description: { type: String, default: "" },
  },
  { versionKey: false, toJSON: { virtuals: true } }
);

module.exports = {
  PermissionModel: mongoose.model("permission", PermissionSchema),
};
