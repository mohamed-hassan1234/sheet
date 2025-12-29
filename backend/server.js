const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =======================
   MIDDLEWARES
======================= */
app.use(cors({
  origin: [
    "http://localhost:5173",
     "http://Al-hafiid.somsoftsystems.com",
    "https://Al-hafiid.somsoftsystems.com",
    "http://www.Al-hafiid.somsoftsystems.com",
    "https://www.Al-hafiid.somsoftsystems.com"
  ],
  credentials: true
}));
app.use(express.json()); 

/* =======================
   ROUTES
======================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/activity", require("./routes/activityRoutes"));
app.use("/api/teachers", require("./routes/teacherRoutes"));
app.use("/api/classes", require("./routes/classRoutes"));
app.use("/api/chapters", require("./routes/chapterRoutes"));
app.use("/api/ranking", require("./routes/rankingRoutes"));
app.use("/api/report", require("./routes/reportRoutes"));
app.use("/api/subjects", require("./routes/subjectRoutes"));
app.use("/api/teacheers", require("./routes/teacheerRoutes"));
app.use("/api", require("./routes/dashboardAdminRoutes"));
app.use("/api/teacher", require("./routes/teacherDashboardRoutes"));


/* =======================
   DEFAULT ROUTE
======================= */
app.get("/", (req, res) => {
  res.send("Teacher Activity & Attendance Management System API Running...");
});

/* =======================
   MONGODB CONNECTION
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

/* =======================
   SERVER LISTEN
======================= */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
