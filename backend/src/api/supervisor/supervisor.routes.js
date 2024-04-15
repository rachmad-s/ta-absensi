const express = require("express");
const { isAuthenticated } = require("../../middlewares");
const { getSupervisors } = require("./supervisor.services");

const router = express.Router();

// GET ALL USER
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const supervisors = await getSupervisors();

    res.json(supervisors);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
