/* eslint-disable no-useless-catch */
const express = require("express");
const {
  createUser,
  getUserByUsername,
  getUser,
  getUserById,
  getAllRoutinesByUser,
  getAllPublicRoutines,
  getPublicRoutinesByUser,
} = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const usersRouter = express.Router();

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      res.send({
        error: "Registration failed",
        name: "UserExistsError",
        message: `User ${username} is already taken.`,
      });
    } else if (password.length < 8) {
      res.send({
        error: "Password error",
        message: "Password Too Short!",
        name: "shortPasswordError",
      });
    } else {
      const response = await createUser(req.body);
      const token = jwt.sign(
        {
          id: response.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
      res.send({
        message: "Thank you for registering",
        token: token,
        user: {
          id: response.id,
          username: response.username,
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }
  try {
    const user = await getUser(req.body);
    if (user) {
      const token = jwt.sign(
        { username: user.username, id: user.id },
        process.env.JWT_SECRET
      );
      res.send({
        token: token,
        user: user,
        message: "you're logged in!",
      });
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/users/me
usersRouter.get("/me", async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    res.status(401);
    res.send({
      error: "Bad token",
      message: "You must be logged in to perform this action",
      name: "invalidToken",
    });
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);

      if (id) {
        const user = await getUserById(id);
        res.send(user);
      }
    } catch (error) {
      next(error);
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

// GET /api/users/:username/routines
usersRouter.get("/:username/routines", async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  try {
    const token = auth.slice(prefix.length);
    const tokenUser = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenUser.username === req.params.username) {
      const response = await getAllRoutinesByUser(req.params);
      res.send(response);
    } else {
      const response = await getPublicRoutinesByUser(req.params);
      res.send(response);
    }
  } catch (error) {}
});

module.exports = usersRouter;
