const { SessionModel } = require("../models/SessionModel");
const Student = require("../models/StudentModel");

exports.getActiveSession = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1. Get student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // 2. Find active session for student's class
    const session = await SessionModel.findOne({
      status: "active",
      section: student.section,
      year: student.year,
      semester: student.semester
    });


    // 3. No session case
    if (!session) {
      return res.json({
        success: true,
        session: null
      });
    }

    // 4. Return minimal session info
    return res.json({
      success: true,
      session: {
        sessionId: session._id,
        subject: session.subject,
        section: session.section,
        year: session.year,
        semester: session.semester,
        startedAt: session.startedAt
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
