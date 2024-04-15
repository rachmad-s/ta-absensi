const express = require("express");
const { isAuthenticated } = require("../../middlewares");
const {
  findDepartmentById,
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} = require("./department.services");

const router = express.Router();

// CREATE USER
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400);
      throw new Error("Field is required");
    }

    const department = await createDepartment({
      name,
    });

    if (department) {
      res.status(200).json(department);
    }
  } catch (err) {
    next(err);
  }
});

// GET ALL USER
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const departments = await getDepartments({
      sort: req.query.sort || "createdAt",
      direction: req.query.direction || "desc",
      name: req.query.name,
    });

    const departmentsWithCount = departments.map((department) => ({
      id: department.id,
      name: department.name,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
      totalTeams: department._count.teams,
      totalEmployees: department.teams
        .map((team) => team._count.profiles)
        .reduce((a, b) => a + b, 0),
    }));

    res.json(departmentsWithCount);
  } catch (err) {
    next(err);
  }
});

// GET USER
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const department = await findDepartmentById(req.params.id);
    res.json(department);
  } catch (err) {
    next(err);
  }
});

// UPDATE USER
router.put("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const department = await updateDepartment(req.params.id, {
      name: req.body.name,
    });
    res.json(department);
  } catch (err) {
    next(err);
  }
});

// DELETE USER
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const department = await deleteDepartment(req.params.id);
    res.json(department);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
