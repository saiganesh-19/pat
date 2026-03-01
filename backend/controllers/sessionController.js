const { SessionModel } = require("../models/SessionModel");
const Student = require("../models/StudentModel");

/**
 * START SESSION
 * Teacher starts a new session
 */
const startSession = async (req, res) => {
  try {
    const {
      teacherId,
      subject,
      department,
      section,
      semester,
      year,
      latitude,
      longitude
    } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Teacher location required to start session"
      });
    }
    const existing = await SessionModel.findOne({
      teacherId,
      status: "active",
    });

    if (existing) {
      return res.status(400).json({
        message: "Active session already exists",
      });
    }


    const newSession = new SessionModel({
      teacherId,
      subject,
      department: department ? department.toUpperCase() : "",
      section: section.toUpperCase(),   // ✅ HERE
      semester: Number(semester),
      year: Number(year),
      latitude: Number(latitude),       // ✅ correct
      longitude: Number(longitude),     // ✅ correct
      radius: 100,
      status: "active",
      startedAt: new Date(),
      attendance: [],
    });

    await newSession.save();

    res.json({
      message: "Session started",
      session: newSession,
    });

  } catch (err) {
    console.error("START SESSION ERROR FULL:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * GET ACTIVE SESSION (Teacher Dashboard)
 */
const getActiveSession = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const session = await SessionModel.findOne({
      teacherId,
      status: "active",
    });

    if (!session) {
      return res.json(null);
    }

    // 🔥 Get all students in this class
    const students = await Student.find({
       department: session.department,  
      section: session.section,
      year: session.year,
      semester: session.semester,
      status: "ACTIVE"
    });

    // 🔥 Merge attendance
    const mergedStudents = students.map((stu) => {
      const record = session.attendance.find((a) =>
        a.studentId.equals(stu._id)
      );

      return {
        studentId: stu._id,
        name: stu.name,
        rollNo: stu.rollNo,
        gpsStatus: record?.gpsStatus || "NOT VERIFIED",
        faceStatus: record?.faceStatus || "-",
        attendanceStatus: record?.attendanceStatus || "ABSENT",
        manual: record?.manual || false
      };
    });

    res.json({
      ...session.toObject(),
      attendance: mergedStudents
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * END SESSION
 */
const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await SessionModel.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.status = "ended";
    session.endedAt = new Date();

    await session.save();

    res.json({
      message: "Session ended",
      session,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * SESSION HISTORY (Recent sessions)
 */
const getSessionHistory = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const sessions = await SessionModel.find({
      teacherId,
      status: "ended",
    })
      .sort({ endedAt: -1 })
      .limit(10);

    // 🔥 Attach totalStudents count
    const sessionsWithCounts = await Promise.all(
      sessions.map(async (session) => {

        const totalStudents = await Student.countDocuments({
          department:session.department,
          section: session.section,
          year: session.year,
          semester: session.semester,
          status: "ACTIVE"
        });

        return {
          ...session.toObject(),
          totalStudents
        };
      })
    );

    res.json(sessionsWithCounts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * MANUAL ATTENDANCE CORRECTION
 */
const manualAttendance = async (req, res) => {
  try {
    const { sessionId, studentId } = req.params;

    const session = await SessionModel.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const record = session.attendance.find(
      (a) => a.studentId.toString() === studentId
    );

    if (record) {
      if (record.manual) {
        // 🔁 If manually marked → remove record (become ABSENT)
        session.attendance = session.attendance.filter(
          (a) => a.studentId.toString() !== studentId
        );
      } else {
        // 🔁 If GPS marked → toggle manual override
        record.manual = true;
        record.gpsStatus = "MANUAL";
      }
    } else {
      // 🔥 If no record → create manual attendance
      const student = await Student.findById(studentId);

      session.attendance.push({
        studentId: student._id,
        name: student.name,
        rollNo: student.rollNo,
        gpsStatus: "MANUAL",
        faceStatus: "SKIPPED",
        attendanceStatus: "PRESENT",
        manual: true,
        markedAt: new Date()
      });
    }

    await session.save();

    res.json({ message: "Manual toggled" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const getTodaySummary = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const sessions = await SessionModel.find({
      teacherId,
      startedAt: {
        $gte: today,
        $lt: tomorrow
      }
    });

    let totalSessions = sessions.length;
    let totalPresent = 0;
    let totalAbsent = 0;

    for (const session of sessions) {

      const totalStudentsInClass = await Student.countDocuments({
        section: session.section,
        year: session.year,
        semester: session.semester,
        department: session.department,
        status: "ACTIVE"
      });

      const presentCount = session.attendance.filter(
        s => s.attendanceStatus === "PRESENT"
      ).length;

      const absentCount = totalStudentsInClass - presentCount;

      totalPresent += presentCount;
      totalAbsent += absentCount;
    }

    res.json({
      success: true,
      totalSessions,
      totalPresent,
      totalAbsent
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  startSession,
  getActiveSession,
  endSession,
  getSessionHistory,
  manualAttendance,
   getTodaySummary ,
};
