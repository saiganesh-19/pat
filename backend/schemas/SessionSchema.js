const { Schema } = require("mongoose");

const AttendanceSchema = new Schema({
  studentId: Schema.Types.ObjectId,
  name: String,              // 🔥 add this (needed for LiveSession)
  rollNo: String,
  gpsStatus: String,
  faceStatus: String,
  attendanceStatus: String,
  manual: Boolean,
  markedAt: Date,
  correctedBy: String,
  correctedAt: Date,
});

const SessionSchema = new Schema({
  teacherId: Schema.Types.ObjectId,
  subject: String,

  department: String,        // 🔥 ADD THIS
  section: String,
  semester: Number,          // better as Number
  year: Number,              // better as Number

  latitude: Number,          // 🔥 add for GPS
  longitude: Number,
  radius: { type: Number, default: 100 },

  status: { type: String, default: "active" },
  startedAt: Date,
  endedAt: Date,

  attendance: [AttendanceSchema],
});

module.exports = { SessionSchema };
