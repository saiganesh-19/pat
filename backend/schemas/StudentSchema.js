const { Schema } = require("mongoose");

const StudentSchema = new Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: Number, required: true },
  semester: { type: Number, required: true },
  section: { type: String, required: true },
  status: { type: String, enum: ["ACTIVE", "BLOCKED"], default: "ACTIVE" },
  faceId: String
}, { timestamps: true });

module.exports = { StudentSchema };
