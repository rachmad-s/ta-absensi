const express = require("express");
const { isAuthenticated } = require("../../middlewares");
const {
  findTeamById,
  createTeam,
  getTeams,
  updateTeam,
  deleteTeam,
} = require("./team.services");
const { db } = require("../../utils/db");

const router = express.Router();

// CREATE TEAM
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { name, departmentId } = req.body;
    if (!name) {
      res.status(400);
      throw new Error("Name is required");
    }

    const team = await createTeam({ name, departmentId });

    if (team) {
      res.status(200).json(team);
    }
  } catch (err) {
    next(err);
  }
});

// GET ALL TEAM
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const teams = await getTeams({
      sort: req.query.sort || "createdAt",
      direction: req.query.direction || "desc",
      name: req.query.name,
      departmentId: req.query.departmentId,
    });
    const teamsWithTotal = teams.map((team) => ({
      id: team.id,
      name: team.name,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      departmentId: team.departmentId,
      department: team.department,
      totalEmployees: team._count.profiles,
    }));
    res.json(teamsWithTotal);
  } catch (err) {
    next(err);
  }
});

// GET TEAM
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const team = await findTeamById(req.params.id);
    res.json(team);
  } catch (err) {
    next(err);
  }
});

// UPDATE TEAM
router.put("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const team = await updateTeam(req.params.id, {
      name: req.body.name,
      departmentId: req.body.departmentId,
    });
    res.json(team);
  } catch (err) {
    next(err);
  }
});

// DELETE TEAM
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const team = await deleteTeam(req.params.id);
    res.json(team);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
