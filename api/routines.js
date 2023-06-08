const express = require("express");
const { getAllRoutines, createRoutine } = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");

// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const response = await getAllRoutines();
    res.send(response);
  } catch (error) {}
});

// POST /api/routines
router.post("/", async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  if (!auth) {
    res.send({
        "error": 'Any<String>',
       "message": "You must be logged in to perform this action",
       "name": 'Any<String>',
      });
  }
  try {
    const token = auth.slice(prefix.length);
    const tokenUser = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenUser.id) {
      console.log(tokenUser.id);
      const response = await createRoutine({
        creatorId: tokenUser.id,
        isPublic: isPublic,
        name: name,
        goal: goal,
      });
      res.send(response);
    } else {
      res.send({
        error: "",
      });
    }
  } catch (error) {}
});

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
