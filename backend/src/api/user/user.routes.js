const express = require("express");
const { isAuthenticated } = require("../../middlewares");
const {
  findUserById,
  getUsers,
  updateUser,
  deleteUser,
  findUserByEmail,
  createUserByEmailAndPassword,
  getUsersCount,
} = require("./user.services");
const { db } = require("../../utils/db");

const router = express.Router();

// CREATE USER
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const {
      email,
      password,
      role,
      name,
      position,
      team,
      supervisorId,
      avatarUrl,
      address,
      level,
    } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("You must provide an email and a password.");
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      res.status(400);
      throw new Error("Email already in use.");
    }

    const user = await createUserByEmailAndPassword({
      email,
      password,
      role,
      name,
      position,
      team,
      supervisorId,
      avatarUrl,
      address,
      level,
    });

    if (user) {
      res.status(201).json({ message: "Successfully", data: user });
    }
  } catch (err) {
    next(err);
  }
});

// GET ALL USER
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const pagination = {
      skip: Number(req.query.skip) || 0,
      take: Number(req.query.take) || 10,
    };

    const user = await getUsers({
      skip: pagination.skip,
      take: pagination.take,
      sort: req.query.sort || "createdAt",
      direction: req.query.direction || "desc",
      filter: req.query.filter,
      role: req.query.role,
      department: req.query.department,
      team: req.query.team,
    });

    const total = await getUsersCount({
      filter: req.query.filter,
      role: req.query.role,
      department: req.query.department,
      team: req.query.team,
    });

    const totalPage = Math.ceil(total / pagination.take);

    res.json({
      data: user,
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

// GET USER
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// UPDATE USER
router.put("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, {
      email: req.body.email,
      role: req.body.role,
      name: req.body.name,
      team: req.body.team,
      supervisorId: req.body.supervisorId,
      address: req.body.address,
      position: req.body.position,
      level: req.body.level,
      avatarUrl: req.body.avatarUrl,
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// DELETE USER
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const user = await deleteUser(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
