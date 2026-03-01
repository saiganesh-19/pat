const mongoose = require("mongoose");
const { TeacherSchema } = require("../schemas/TeacherSchema");

const TeacherModel = mongoose.model("teacher", TeacherSchema);

module.exports = { TeacherModel };
