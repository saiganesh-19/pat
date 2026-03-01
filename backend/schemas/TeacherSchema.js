const { Schema } = require("mongoose");

const TeacherSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  department: String,
  sectionsHandled: [String],
});

module.exports = { TeacherSchema };
