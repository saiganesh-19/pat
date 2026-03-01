const { SessionModel } = require("../models/SessionModel");
const Student = require("../models/StudentModel");

exports.getSummary = async (req, res) => {
  try {
    const today = new Date();
today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

    const studentId = req.user.id;

    const student = await Student.findById(studentId);

const sessions = await SessionModel.find({
  section: student.section,
  year: student.year,
  semester: student.semester,
  department: student.department,
  status: { $in: ["active", "ended"] },  // 🔥 important
  startedAt: {
    $gte: today,
    $lt: tomorrow
  }
});



    const total = sessions.length;

   let attended = sessions.filter(session =>
  session.attendance.some(a =>
    a.studentId.equals(student._id)
  )
).length;
   
     let percentage = 0;
if (total > 0) {
  percentage = Math.round((attended / total) * 100);
}
    res.json({
      success: true,
      total,
      attended,
      remaining: total - attended,
      percentage
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};
