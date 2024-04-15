const express = require("express");
const { isAuthenticated } = require("../../middlewares");
const {
  createPublicHoliday,
  getPublicHoliday,
  updatePublicHoliday,
  deletePublicHoliday,
} = require("./publicHoliday.services");

const router = express.Router();

// CREATE PUBLIC HOLIDAY
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { name, date } = req.body;
    if (!name) {
      res.status(400);
      throw new Error("Field is required");
    }

    const publicHoliday = await createPublicHoliday({
      name,
      date,
    });

    if (publicHoliday) {
      res.status(200).json(publicHoliday);
    }
  } catch (err) {
    next(err);
  }
});

// GET ALL PUBLIC HOLIDAY
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const publicHolidays = await getPublicHoliday({
      sort: req.query.sort || "date",
      direction: req.query.direction || "asc",
      year: req.query.year || new Date().getFullYear().toString(),
      month: req.query.month,
      name: req.query.name,
    });

    res.json(publicHolidays);
  } catch (err) {
    next(err);
  }
});

// UPDATE USER
router.put("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const publicHoliday = await updatePublicHoliday(req.params.id, {
      name: req.body.name,
      date: req.body.date,
    });
    res.json(publicHoliday);
  } catch (err) {
    next(err);
  }
});

// DELETE USER
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const publicHoliday = await deletePublicHoliday(req.params.id);
    res.json(publicHoliday);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
