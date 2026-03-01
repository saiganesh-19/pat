import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroItems from "./HeroItems";
import { getActiveSessionApi,getTodaySummary } from "../api/sessionApi";

const TEACHER_ID = "65f0abcd1234abcd1234abcd"; // temp hardcode

function Hero() {
  const [summary, setSummary] = useState(null);
  const [activeSession, setActiveSession] = useState(null);

useEffect(() => {
  getTodaySummary(TEACHER_ID)
    .then((res) => {
      setSummary(res.data);
    })
    .catch((err) => console.log(err));
}, []);


  const sessionCount = activeSession ? 1 : 0;

  const totalStudents = activeSession
    ? activeSession.students.length
    : 0;

  const presentCount = activeSession
    ? activeSession.students.filter(
        (s) => s.attendance === "present"
      ).length
    : 0;

  const absentCount = totalStudents - presentCount;

return (
  <div className="pt-5 px-4 md:px-0">

    {/* Top Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-9">

      <HeroItems
        name="Active session"
        logo={
          <i className="fa-solid fa-clipboard-list text-blue-500 text-xl"></i>
        }
        total={summary?.totalSessions || 0}
        desc="currently Running"
      />

      <HeroItems
        name="Present"
        logo={
          <i className="fa-solid fa-user-check text-green-500 text-xl"></i>
        }
        total={summary?.totalPresent || 0}
        desc="Student Present"
      />

      <HeroItems
        name="Absent"
        logo={
          <i className="fa-solid fa-user-xmark text-red-500 text-xl"></i>
        }
        total={summary?.totalAbsent || 0}
        desc="Student Absent"
      />

    </div>

    {/* Action Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-7">

      {/* Start Session */}
      <div className="rounded-lg border border-gray-200 bg-white flex items-center p-5 shadow-sm hover:shadow-md transition">

        <div className="p-3 bg-blue-100 rounded-lg mr-4">
          <i className="fa-solid fa-plus text-blue-500 text-2xl"></i>
        </div>

        <Link to="/session">
          <h1 className="font-semibold text-lg md:text-xl">
            Start New Session
          </h1>
          <p className="text-sm text-gray-500">
            Begin attendance tracking for a class
          </p>
        </Link>

      </div>

      {/* Reports */}
      <div className="rounded-lg border border-gray-200  bg-white flex items-center p-5 shadow-sm hover:shadow-md transition">

        <div className="p-3 bg-green-100 rounded-lg mr-4">
          <i className="fa-solid fa-file-lines text-green-500 text-2xl"></i>
        </div>

        <div>
          <h1 className="font-semibold text-lg md:text-xl">
            View Reports
          </h1>
          <p className="text-sm text-gray-500">
            Check attendance history and analytics
          </p>
        </div>

      </div>

    </div>

  </div>
);

}

export default Hero;
