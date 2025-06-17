const mongoose = require("mongoose");

const operationsLogSchema = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    operation: {
      type: String,
      enum: ["Get", "Update", "Delete", "Create"],
      required: true,
    },
    entity_type: {
      type: String,
      enum: ["question", "category", "age_group", "admin"],
      required: true,
    },
    entity_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    details: {
      type: String,
      default: null,
      required: false,
    },
  },
  { timestamps: true }
);

const OperationsLog = mongoose.model("OperationsLog", operationsLogSchema);

module.exports = OperationsLog;
