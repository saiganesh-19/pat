require("dotenv").config();
const express = require("express");
const mongoose=require("mongoose");
const cors = require("cors");

const uri=process.env.MONGO_URI;
const PORT=process.env.PORT || 5000;
const app=express();

app.use(express.json());

const sessionRoutes = require("./routes/sessionRoutes");

app.use(cors({
  origin: "*", // frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use("/api/students", require("./routes/studentAuth.routes"));
app.use("/api/sessions", sessionRoutes);
app.use("/api/students", require("./routes/studentProtected.routes"));
app.use("/api/students", require("./routes/studentSession.routes"));
app.use("/api/students", require("./routes/studentAttendance.routes"));
app.use("/api/students", require("./routes/studentSummary.routes"));




app.get("/test", (req, res) => {
  res.send("API working");
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  mongoose.connect(uri)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));
});



