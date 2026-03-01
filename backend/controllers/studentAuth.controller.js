const Student = require("../models/StudentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, rollNo, email, password, department, year, semester, section } = req.body;

    if (!semester) {
      return res.status(400).json({
        success: false,
        message: "Semester is required"
      });
    }

    const exists = await Student.findOne({
      $or: [{ rollNo }, { email }]
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Student already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Student.create({
      name,
      rollNo,
      email,
      password: hashedPassword,
      department,
      year: Number(year),
      semester: Number(semester),
      section: section.toUpperCase(),
    });

    res.status(201).json({
      success: true,
      message: "Signup successful"
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { rollNo, password } = req.body;
     console.log("BODY:", req.body);

    const student = await Student.findOne({ rollNo });
     console.log("Student found:", student);
    if (!student) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (student.status !== "ACTIVE") {
      return res.status(403).json({ success: false, message: "Account blocked" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    const testMatch = await bcrypt.compare("12345", student.password);
console.log("Test compare with 12345:", testMatch);

    console.log("Password match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: student._id, role: "STUDENT" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      success: true,
      token,
      student: {
        id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        department: student.department,
        year: student.year,
        semester:student.semester,
        section: student.section
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
