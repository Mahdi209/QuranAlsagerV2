const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question_text: { type: String, required: true },
    option1: { type: String, required: true },
    option2: { type: String, required: true },
    option3: { type: String, required: true },
    correctOption: { type: String, required: true },
    timeLimitSec: { type: Number, default: 30 },
    is_deleted: { type: Boolean, default: false },
    status: {
      type: Boolean,
      default: true,
    },
    deleted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    deleted_at: { type: Date, default: null },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    updated_at: { type: Date, default: null },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    ageGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AgeGroup",
      required: true,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
