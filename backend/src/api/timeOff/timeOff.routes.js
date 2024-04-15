const express = require("express");
const { isAuthenticated } = require("../../middlewares");
const {
  settleTimeOf,
  getTimeOff,
  createTimeOff,
  updateTimeOff,
  deleteTimeOff,
} = require("./timeOff.services");
const { db } = require("../../utils/db");
const { findUserById } = require("../user/user.services");

const router = express.Router();

/**
 *  GET TIME OFFS
 */
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const params = {
      myId: req.user.userId,
      subordinate: req.query.subordinate,
      userId: req.query.userId,
      teamId: req.query.teamId,
      departmentId: req.query.departmentId,
      type: req.query.type,
      status: req.query.status,
      year: req.query.year || new Date().getFullYear().toString(),
      month: req.query.month,
      search: req.query.search,
      withoutMe: req.query.withoutMe,
    };
    const response = await getTimeOff({
      myId: params.myId,
      subordinate: params.subordinate,
      userId: params.userId,
      teamId: params.teamId,
      departmentId: params.departmentId,
      type: params.type,
      status: params.status,
      year: params.year,
      month: params.month,
      search: params.search,
      withoutMe: params.withoutMe,
    });

    res.json(response);
  } catch (err) {
    next(err);
  }
});

/**
 *  REQUEST A TIME OFF
 */
router.post("/request", isAuthenticated, async (req, res, next) => {
  try {
    const { type, attachment, message, days, startDate } = req.body;
    const userId = req.user.userId;

    const response = await createTimeOff({
      type,
      attachment,
      message,
      days,
      startDate,
      userId,
    });

    res.json(response);
  } catch (err) {
    next(err);
  }
});

/**
 *  GET TIME OFF QUOTA
 */
router.get("/quota", isAuthenticated, async (req, res, next) => {
  try {
    const year = new Date().getFullYear().toString();
    const userId = req.user.userId;

    const approvedTimeOff = await getTimeOff({
      userId,
      year,
      status: "APPROVED",
    });
    const timeOffConfig = await db.timeOffConfig.findMany();

    const getApprovedTimeOff = (name) => {
      const totalTaken = approvedTimeOff
        .filter((approved) => approved.type === name)
        .map((approved) => approved.days);
      return totalTaken.reduce((a, b) => a + b, 0);
    };

    const response = timeOffConfig.map((config) => ({
      ...config,
      quotaLeft: Number(config.quota) - getApprovedTimeOff(config.name),
    }));

    res.json(response);
  } catch (err) {
    next(err);
  }
});

/**
 *  UPDATE A TIME OFF
 */
router.put("/:id/update", isAuthenticated, async (req, res, next) => {
  try {
    const { type, attachment, message } = req.body;
    const { id } = req.params;

    const response = await updateTimeOff({
      type,
      attachment,
      message,
      requestId: id,
    }).then(async (res) => {
      await db.requestActions.deleteMany({
        where: {
          AND: [
            {
              timeOffRequest: {
                id: res.id,
              },
            },
            {
              status: "REJECTED",
            },
          ],
        },
      });
    });

    res.json(response);
  } catch (err) {
    next(err);
  }
});

/**
 *  DELETE A TIME OFF
 */
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await deleteTimeOff({
      requestId: id,
    });

    res.json(response);
  } catch (err) {
    next(err);
  }
});

/**
 *  SETTLE A TIMEOFF
 */
router.post("/:requestId/settle", isAuthenticated, async (req, res, next) => {
  try {
    const response = await settleTimeOf({
      requestId: req.params.requestId,
      status: req.body.status,
      remarks: req.body.remarks,
      createdBy: req.user.userId,
    });

    res.json(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
