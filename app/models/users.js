const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    username: { type: String, lowercase: true },
    mobile: { type: String, required: true },
    email: { type: String, lowercase: true },
    password: { type: String },
    otp: {
      type: Object,
      default: { code: 0, expiresIn: 0 },
    },
    bills: { type: [], default: [] },
    discount: { type: Number, default: 0 },
    birthday: { type: String },
    roles: { type: [String], default: ["USER"] },
    createdAt: { type: Date, default: new Date().getTime() },
    courses: { type: [mongoose.Types.ObjectId], default: [], ref: "course" },
  },
  { versionKey: false, toJSON: { virtuals: true } }
);

module.exports = { UserModel: mongoose.model("user", Schema) };
