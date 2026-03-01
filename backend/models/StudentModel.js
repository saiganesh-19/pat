const mongoose = require("mongoose");
const { StudentSchema } = require("../schemas/StudentSchema");

const StudentModel = mongoose.model("Student", StudentSchema);

module.exports = StudentModel;
