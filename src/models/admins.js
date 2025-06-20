const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roleId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true }],
    refreshToken: { type: String },
    tokenVersion: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
