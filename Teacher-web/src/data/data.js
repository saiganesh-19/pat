// data.js

// Generate 20 dummy students
export const dummyStudents = Array.from({ length: 20 }, (_, i) => ({
  id: `stu${i + 1}`,
  rollNo: `CS${String(i + 1).padStart(3, "0")}`,
  name: `Student ${i + 1}`,
  gpsStatus: "pending",   // verified | failed | pending
  faceStatus: "pending", // verified | failed | pending
  attendance: "absent",  // present | absent
  manual: false
}));

// Teacher Data
export const teacherData = {
  id: "t001",
  name: "Teacher A",

  // Live session (null when no session running)
  activeSession: null,

  // Past sessions
  sessionHistory: []
};
