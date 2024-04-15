const express = require("express");
const { isAuthenticated } = require("../../middlewares");
const {
  settleOverTime,
  getOverTime,
  createOverTime,
  updateOverTime,
  deleteOverTime,
} = require("./overTime.services");
const { db } = require("../../utils/db");

const router = express.Router();

/**
 *  GET OVERTIMES
 */
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const params = {
      myId: req.user.userId,
      subordinate: req.query.subordinate,
      userId: req.query.userId,
      teamId: req.query.teamId,
      departmentId: req.query.departmentId,
      year: req.query.year || new Date().getFullYear().toString(),
      month: req.query.month,
      search: req.query.search,
      withoutMe: req.query.withoutMe,
    };
    const response = await getOverTime({
      myId: params.myId,
      subordinate: params.subordinate,
      userId: params.userId,
      teamId: params.teamId,
      departmentId: params.departmentId,
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
    const { message, date, duration } = req.body;
    const userId = req.user.userId;

    const response = await createOverTime({
      message,
      duration,
      userId,
      date,
    });

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
    const { message, date, duration } = req.body;
    const { id } = req.params;

    const response = await updateOverTime({
      message,
      date,
      duration,
      requestId: id,
    }).then(async (res) => {
      await db.requestActions.deleteMany({
        where: {
          AND: [
            {
              overTimeRequest: {
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

    const response = await deleteOverTime({
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
    const response = await settleOverTime({
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
