const express = require("express");
const bcrypt = require("bcrypt");
const {
  findUserByEmail,
  createUserByEmailAndPassword,
} = require("../user/user.services");
const { generateAccessToken } = require("../../utils/jwt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      const auth = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      if (auth) {
        res.status(200).json({
          data: auth,
        });
      }
    }
    res.status(400);
    throw new Error("Invalid Token");
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("You must provide an email and a password.");
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      res.status(400);
      throw new Error("Email already in use.");
    }

    const user = await createUserByEmailAndPassword({ email, password });

    if (user) {
      res
        .status(200)
        .json({ message: "Successfully, please login to your account" });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("You must provide an email and a password.");
    }

    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      res.status(403);
      throw new Error("Invalid login credentials.");
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      res.status(403);
      throw new Error("Invalid login credentials.");
    }

    const accessToken = generateAccessToken(existingUser);

    res.status(200).json({
      accessToken,
      user: existingUser,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
