const { SessionModel } = require("../models/SessionModel");
const Student = require("../models/StudentModel");

const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

exports.markAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { latitude, longitude } = req.body;

        // 🔥 Validate GPS input
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Location not received"
      });
    }

    const lat = Number(latitude);
    const lon = Number(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        success: false,
        message: "Invalid location data"
      });
    }

    // 1️⃣ Fetch student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // 2️⃣ Auto-find ACTIVE session
const session = await SessionModel.findOne({
  status: "active",
  section: student.section.toUpperCase(),
  year: Number(student.year),
  semester: Number(student.semester),
  department: student.department.toUpperCase(),
});

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "No active session"
      });
    }

    // 3️⃣ Prevent duplicate
const alreadyMarked = Array.isArray(session.attendance) &&
  session.attendance.some(
    (a) => a.studentId.toString() === studentId
  );


    if (alreadyMarked) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked"
      });
    }

    // 4️⃣ Calculate distance
const distance = getDistanceInMeters(
  lat,
  lon,
  session.latitude,
  session.longitude
);
console.log("Distance:", distance, "meters");


    if (distance > session.radius) {
      return res.status(403).json({
        success: false,
        message: "Outside allowed location"
      });
    }

    // 5️⃣ Push attendance
    session.attendance.push({
      studentId: student._id,
      name: student.name,
      rollNo: student.rollNo,
      gpsStatus: "VERIFIED",
      faceStatus: "SKIPPED",
      attendanceStatus: "PRESENT",
      manual: false,
      markedAt: new Date()
    });

    await session.save();

    return res.json({
      success: true,
      message: "Attendance marked successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
