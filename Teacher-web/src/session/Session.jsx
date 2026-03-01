import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { startSessionApi } from "../api/sessionApi";

const TEACHER_ID = "65f0abcd1234abcd1234abcd"; // temp hardcode

function Session() {
  const navigate = useNavigate();
const [location, setLocation] = useState(null);
const [loading, setLoading] = useState(false);
const [form, setForm] = useState({
    semester: "",
    section: "",
    year: "",
    sessionCount: 1,
    subject: "",
    department: "",
  });

  useEffect(() => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      console.log("GPS prefetched");
    },
    (error) => {
      console.log("GPS prefetch failed:", error.message);
    },
    {
      enableHighAccuracy: false,
      timeout: 5000,
    }
  );
}, []);
 
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const getTeacherLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(error.message),
      { enableHighAccuracy: false, timeout: 5000 }

    );
  });
};
  

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    let coords = location;

    // If GPS not ready yet, fetch again
    if (!coords) {
      coords = await getTeacherLocation();
    }

    const res = await startSessionApi({
      teacherId: TEACHER_ID,
      subject: form.subject,
      department: form.department,
      section: form.section,
      semester: form.semester,
      year: form.year,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    navigate("/livesession", {
      state: { session: res.data.session },
    });

  } catch (err) {
    alert(err.response?.data?.message || err);
  } finally {
    setLoading(false);
  }
};



  return (
  <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm w-full">
        
        {/* Header */}
       <div className="p-6 pb-0 md:p-10 pb-4">
          <h1 className="text-xl md:text-2xl font-semibold">
            Start Attendance Session
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Configure class details to begin tracking attendance
          </p>
        </div>

        {/* Inputs */}
<div className="grid grid-cols-1 pt-0 md:grid-cols-2 gap-4 md:gap-6 p-6 md:p-10 pt-0">

  {/* Semester */}
  <label className="flex flex-col gap-1">
    <h3>Semester</h3>
    <input
      name="semester"
      value={form.semester}
      onChange={handleChange}
      className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3
      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
      type="text"
      placeholder="Select semester"
      required
    />
  </label>

  {/* Section */}
  <label className="flex flex-col gap-1">
    <h3>Section</h3>
    <input
      name="section"
      value={form.section}
      onChange={handleChange}
      className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3
      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
      type="text"
      placeholder="Select section"
      required
    />
  </label>

  {/* Year */}
  <label className="flex flex-col gap-1">
    <h3>Year</h3>
    <input
      name="year"
      value={form.year}
      onChange={handleChange}
      className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3
      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
      type="text"
      placeholder="Select year"
      required
    />
  </label>

  {/* Subject */}
  <label className="flex flex-col gap-1">
    <h3>Subject</h3>
    <input
      name="subject"
      value={form.subject}
      onChange={handleChange}
      className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3
      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
      type="text"
      placeholder="Eg: DBMS"
      required
    />
  </label>

  {/* Sessions */}
  <label className="flex flex-col gap-1">
    <h3>Number of Sessions</h3>
    <input
      name="sessionCount"
      value={form.sessionCount}
      onChange={handleChange}
      className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3
      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
      type="number"
      min="1"
      placeholder="Eg: 2"
      required
    />
  </label>

  {/* Department */}
  <label className="flex flex-col gap-1">
    <h3>Department</h3>
    <select
      name="department"
      value={form.department}
      onChange={handleChange}
      className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3
      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
      required
    >
      <option value="">Select Department</option>
      <option value="CSE">CSE</option>
      <option value="BCOM">BCOM</option>
      <option value="ECE">ECE</option>
    </select>
  </label>

</div>


        {/* GPS Info */}
        <div className="p-4 mx-6 md:mx-10 bg-gray-100 border border-gray-200 rounded-md flex gap-3">
          <i className="fa-solid fa-location-dot text-blue-500 text-lg md:text-xl mt-1"></i>
          <div>
            <h1 className="font-semibold">GPS Location</h1>
            <p className="text-gray-500 text-xs md:text-sm">
              Your location will be automatically captured when you start the session.
              Students must be within 30 meters to mark attendance.
            </p>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center p-6">
          <button
  type="submit"
  disabled={loading}
  className="bg-blue-500 text-white rounded-md w-full md:w-80 h-10"
>
  {loading ? "Starting..." : "Start Session"}
</button>

        </div>

      </div>
    </form>
  </div>
);

}
export default Session;
