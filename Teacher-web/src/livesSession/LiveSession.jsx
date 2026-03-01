import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  getActiveSessionApi,
  endSessionApi,
  manualAttendanceApi,
} from "../api/sessionApi";

const TEACHER_ID = "65f0abcd1234abcd1234abcd";


function LiveSession() {
  const navigate = useNavigate();
  const location = useLocation();
const [session, setSession] = useState(location.state?.session || null);


useEffect(() => {
  const fetchSession = async () => {
    try {
      const res = await getActiveSessionApi(TEACHER_ID);
      setSession(res.data);
    } catch {
      setSession(null);
    }
  };

  fetchSession(); // initial load
 
  const interval = setInterval(fetchSession, 3000); // refresh every 3 seconds

  return () => clearInterval(interval); // cleanup
}, []);


  if (!session || !session.attendance) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">No active session. Start one first.</p>
      </div>
    );
  }

  const students = session.attendance;

  const presentCount = students.filter(
    (s) => s.attendanceStatus === "PRESENT"
  ).length;

  const absentCount = students.length - presentCount;

  const toggleManual = async (studentId) => {
    await manualAttendanceApi(session._id, studentId);
    const updated = await getActiveSessionApi(TEACHER_ID);
    setSession(updated.data);
  };

  const endSession = async () => {
    await endSessionApi(session._id);
    navigate("/");
  };

  return (
<div className="mx-4 md:mx-6">
  <div className="flex flex-col md:flex-row md:justify-between md:items-center 
  w-full rounded-lg border bg-white p-4 md:p-5 mt-2 shadow-sm gap-4">

    <div>
      <h1 className="text-lg md:text-2xl font-semibold">
        {session.subject} - Section {session.section}
      </h1>
      <p className="text-gray-400 text-xs md:text-sm">
        Session Active | Present: {presentCount} | Absent: {absentCount}
      </p>
    </div>

    <button
      onClick={endSession}
      className="self-start md:self-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
    >
      End Session
    </button>

  </div>


 <div className="rounded-lg border bg-white mt-10 w-full p-4 md:p-6 shadow-sm">
  <h1 className="text-lg md:text-xl font-semibold mb-4">
    Student Attendance
  </h1>

  {/* Table Wrapper for Mobile Scroll */}
  <div className="overflow-x-auto">
    <table className="min-w-[700px] w-full border-collapse text-sm md:text-base">
      <thead>
        <tr className="text-left border-b border-gray-200">
          <th className="py-2 pr-4">Name</th>
          <th className="py-2 pr-4">Roll No</th>
          <th className="py-2 pr-4">GPS</th>
          <th className="py-2 pr-4">Face</th>
          <th className="py-2 pr-4">Attendance</th>
          <th className="py-2 pr-4">Manual</th>
        </tr>
      </thead>

      <tbody>
        {students.map((student) => (
          <tr
            key={student.studentId}
            className="border-b border-gray-200 hover:bg-gray-50"
          >
            <td className="py-3 pr-4">{student.name}</td>
            <td className="py-3 pr-4 text-blue-600">
              {student.rollNo}
            </td>
            <td className="py-3 pr-4">{student.gpsStatus}</td>
            <td className="py-3 pr-4">{student.faceStatus}</td>

            <td className="py-3 pr-4">
              <span
                className={`px-3 py-1 text-xs md:text-sm rounded-full ${
                  student.attendanceStatus === "PRESENT"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {student.attendanceStatus}
              </span>
            </td>

            <td className="py-3 pr-4">
              <input
                type="checkbox"
                checked={student.manual}
                onChange={() => toggleManual(student.studentId)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      </div>
 
  );
}

export default LiveSession;
