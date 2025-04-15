const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../config/database");
const requireAuth = require("../utils");

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const MIN_PASSWORD_LENGTH = 6;

router.get("/me", requireAuth, async (req, res) => {
  const { id, username } = req.user;
  res.json({ id, username });
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || password.length < MIN_PASSWORD_LENGTH) {
    return res
      .status(400)
      .json({
        error:
          "Username and password required. Password must be at least 6 characters long",
      });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username already taken! Try again." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({ token, username: newUser.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({
          error: "Invalid credentials. Please check the username and password",
        });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed." });
  }
});

module.exports = router;
