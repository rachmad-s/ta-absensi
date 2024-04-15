const express = require("express");

const auth = require("./auth/auth.routes");
const user = require("./user/user.routes");
const team = require("./team/team.routes");
const department = require("./department/department.routes");
const supervisor = require("./supervisor/supervisor.routes");
const attendance = require("./attendance/attendance.routes");
const config = require("./config/config.routes");
const timeOff = require("./timeOff/timeOff.routes");
const overTime = require("./overTime/overTime.routes");
const publicHoliday = require("./publicHoliday/publicHoliday.routes");
const upload = require("./upload/upload.routes");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/auth", auth);
router.use("/user", user);
router.use("/team", team);
router.use("/department", department);
router.use("/supervisor", supervisor);
router.use("/attendance", attendance);
router.use("/config", config);
router.use("/time-off", timeOff);
router.use("/over-time", overTime);
router.use("/public-holiday", publicHoliday);
router.use("/upload", upload);

module.exports = router;
