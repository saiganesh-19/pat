import React, { useEffect, useState } from "react";
import RecentItems from "./RecentItems";
import { getSessionHistoryApi } from "../api/sessionApi";

const TEACHER_ID = "65f0abcd1234abcd1234abcd"; // temp hardcode

function RecentSession() {
  const [sessionHistory, setSessionHistory] = useState([]);

  useEffect(() => {
    getSessionHistoryApi(TEACHER_ID)
      .then((res) => {
        // take last 2 sessions, latest first
        setSessionHistory(res.data.reverse().slice(-2));
      })
      .catch(() => {
        setSessionHistory([]);
      });
  }, []);

return (
  <div className="bg-white border border-gray-300 rounded-lg shadow-md p-5 md:p-6 mt-6">

    <h1 className="text-lg md:text-2xl font-semibold mb-5">
      Recent Sessions
    </h1>

    <div className="flex flex-col gap-4">
      {sessionHistory.map((s, i) => (
        <div
          key={i}
          className="flex justify-between items-center 
          border border-gray-400   bg-white rounded-2xl shadow-md p-4  bg-gray-100 hover:bg-gray-200 transition"
        >
          <span className="font-medium">
            {s.subject} - {s.section}
          </span>

          <span className="text-green-600 font-medium text-sm">
            {
              s.attendance.filter(
                (stu) => stu.attendanceStatus === "PRESENT"
              ).length
            } / {s.totalStudents} present
          </span>
        </div>
      ))}
    </div>

  </div>
);

}

export default RecentSession;
