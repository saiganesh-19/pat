import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const startSessionApi = (data) =>
  API.post("/sessions/start", data);

export const getActiveSessionApi = (teacherId) =>
  API.get(`/sessions/active/${teacherId}`);

export const endSessionApi = (sessionId) =>
  API.post(`/sessions/end/${sessionId}`);

export const getSessionHistoryApi = (teacherId) =>
  API.get(`/sessions/history/${teacherId}`);

export const manualAttendanceApi = (sessionId, studentId) =>
  API.put(`/sessions/${sessionId}/attendance/${studentId}`);
export const getTodaySummary = (teacherId) =>
  API.get(`/sessions/today-summary/${teacherId}`);