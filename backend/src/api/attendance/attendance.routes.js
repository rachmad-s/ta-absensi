const express = require("express");
const { isAuthenticated } = require("../../middlewares");
const {
  createAttendance,
  getUserAttendanceByDate,
  createBulkAttendance,
  updateAttendance,
  getAllAttendanceByDate,
  getAllAttendance
} = require("./attendance.services");
const moment = require("moment");
const {
  getAttendanceSummary,
  getMinimumAttendance,
} = require("../../utils/helper");
const { findTeamById } = require("../team/team.services");
const { getUsers, getUsersCount } = require("../user/user.services");

const router = express.Router();

// CREATE TE
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { type, photoUrl, date, status, similarity } = req.body;
    if (!type || !userId || !photoUrl) {
      res.status(400);
      throw new Error("Field is required");
    }

    const attendance = await createAttendance({ type, userId, photoUrl, date, status, similarity });

    if (attendance) {
      res.status(200).json(attendance);
    }
  } catch (err) {
    next(err);
  }
});

router.put("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const id = req.params.id

    const attendance = await updateAttendance(id, { remarks: req.body.remarks, status: req.body.status });

    if (attendance) {
      res.status(201).json(attendance);
    }
  } catch (err) {
    next(err);
  }
});

router.post("/bulk", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400);
      throw new Error("User ID is required");
    }

    function randomWithProbability(random) {
      var numbers = [];
      Object.keys(random).forEach((key) => {
        numbers.push(...Array(random[key]).fill(key));
      });
      var idx = Math.floor(Math.random() * numbers.length);
      return numbers[idx];
    }

    let startDate = moment(new Date("2023-10-01"));
    const endDate = moment({ date: "12" });
    const dateArray = [];

    while (startDate < endDate) {
      const isAttend = randomWithProbability({
        0: 0,
        1: 10,
      });
      if (!(startDate.day() === 0 || startDate.day() === 6) && isAttend != 0) {
        dateArray.push(
          ...[
            {
              type: "IN",
              userId: userId,
              photoUrl:
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              date: moment({
                date: startDate.toDate().getDate(),
                month: startDate.toDate().getMonth(),
                year: startDate.toDate().getFullYear(),
                hour: randomWithProbability({
                  8: 8,
                  9: 2,
                }),
                minute: randomWithProbability({
                  0: 5,
                  1: 3,
                  4: 7,
                  7: 4,
                  11: 6,
                  14: 1,
                  17: 4,
                  18: 5,
                  19: 5,
                  20: 3,
                  22: 2,
                  24: 2,
                  26: 3,
                  29: 4,
                  31: 1,
                  36: 3,
                  42: 2,
                  48: 2,
                  53: 3,
                  57: 5,
                }),
                second: Math.floor(Math.random() * 59),
              }),
            },
            {
              type: "OUT",
              userId: userId,
              photoUrl:
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              date: moment({
                date: startDate.toDate().getDate(),
                month: startDate.toDate().getMonth(),
                year: startDate.toDate().getFullYear(),
                hour: randomWithProbability({
                  17: 8,
                  18: 2,
                }),
                minute: Math.floor(Math.random() * 59),
                second: Math.floor(Math.random() * 59),
              }),
            },
          ]
        );
      }

      startDate.add(1, "days");
    }

    const attendances = await createBulkAttendance(dateArray);
    if (attendances) {
      res.status(200).json(attendances);
    }
  } catch (err) {
    next(err);
  }
});

// GET ALL TE
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const month = req.query.month;
    const year = req.query.year;
    const departmentId = req.query.departmentId;
    const teamId = req.query.teamId;
    const status = req.query.status;
    const type = req.query.type;
    const withoutMe = req.query.withoutMe;
    const myId = req.user.userId

    const attendance = await getAllAttendance({ userId, month, year, status, departmentId, teamId, type, myId, withoutMe, type })
    res.json(attendance);
  } catch (err) {
    next(err);
  }
});

// GET ATTENDANCES BY USER ID AND DATE
router.get(
  "/user/:id/:year/:month",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const month = req.params.month;
      const year = req.params.year;
      const attendanceSummary = await getAttendanceSummary({
        userId,
        month,
        year,
      });

      res.json(attendanceSummary);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/user/:id/:year/:month/:date",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const month = String(Number(req.params.month) - 1);
      const attendances = await getUserAttendanceByDate({
        userId: req.params.id,
        year: req.params.year,
        month,
        date: req.params.date,
      });

      res.json(attendances);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/all/:year/:month/:date",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const month = String(Number(req.params.month) - 1);
      const attendances = await getAllAttendanceByDate({
        year: req.params.year,
        month,
        date: req.params.date,
      });

      res.json(attendances);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/team/:id/:year/:month",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const teamId = req.params.id;
      const month = req.params.month;
      const year = req.params.year;

      const team = await findTeamById(teamId);

      const users = team.profiles;

      for (let i = 0; i < users.length; i++) {
        const attendanceSummary = await getAttendanceSummary({
          userId: users[i].userId,
          month,
          year,
        });
        users[i].attendance = attendanceSummary;
      }

      res.json(users);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/minimum/:year/:month", isAuthenticated, async (req, res, next) => {
  try {
    const month = req.params.month;
    const year = req.params.year;

    const attendance = await getMinimumAttendance({
      month,
      year,
    });

    res.json(attendance);
  } catch (err) {
    next(err);
  }
});

router.get("/:year/:month", isAuthenticated, async (req, res, next) => {
  try {
    const month = req.params.month;
    const year = req.params.year;

    const department = req.query.department;
    const team = req.query.team;
    const search = req.query.search;

    const pagination = {
      skip: Number(req.query.skip) || 0,
      take: Number(req.query.take) || 10,
    };

    const users = await getUsers({
      skip: pagination.skip,
      take: pagination.take,
      department,
      team,
      filter: search,
    });

    for (let i = 0; i < users.length; i++) {
      const attendanceSummary = await getAttendanceSummary({
        userId: users[i].id,
        month,
        year,
      });
      users[i].attendance = attendanceSummary;
    }
    const total = await getUsersCount({
      department,
      team,
      filter: search,
    });
    const totalPage = Math.ceil(total / pagination.take);

    res.json({
      data: users,
      pagination: {
        total,
        currentPage:
          pagination.skip < pagination.take
            ? 1
            : Math.ceil((pagination.skip + 1) / pagination.take),
        totalPage,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
