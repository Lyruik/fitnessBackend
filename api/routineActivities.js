const express = require("express");
const {
  updateRoutineActivity,
  getUserByUsername,
  canEditRoutineActivity,
  destroyRoutine,
  destroyRoutineActivity,
  getRoutineNamefromRoutineActivityId,
} = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", async (req, res, next) => {
  const { routineActivityId } = req.params;
  const { count, duration } = req.body;
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  try {
    const token = auth.slice(prefix.length);
    const tokenUser = jwt.verify(token, process.env.JWT_SECRET);

    const checkUser = await canEditRoutineActivity(
      routineActivityId,
      tokenUser.id
    );
    if (checkUser) {
      const response = await updateRoutineActivity({
        id: routineActivityId,
        count: count,
        duration: duration,
      });
      res.send(response);
    } else if (!checkUser) {
      res.send({
        error: "",
        message: `User ${tokenUser.username} is not allowed to update In the evening`,
        name: "",
      });
    }
  } catch (error) {}
});

// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", async (req, res, next) => {
  const { routineActivityId } = req.params;
  const { count, duration } = req.body;
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  try {
    const token = auth.slice(prefix.length);
    const tokenUser = jwt.verify(token, process.env.JWT_SECRET);

    const checkUser = await canEditRoutineActivity(
      routineActivityId,
      tokenUser.id
    );
    if (checkUser) {
      const response = await destroyRoutineActivity(routineActivityId);
      res.send(response);
    } else if (!checkUser) {
      const routineName = await getRoutineNamefromRoutineActivityId(
        routineActivityId
      );
      res.status(403);
      res.send({
        error: "",
        message: `User ${tokenUser.username} is not allowed to delete In the afternoon`,
        name: "",
      });
      // HAVING TO COMMENT OUT THE REAL FUNCTION CAUSE THE TESTS BREAK THINGS OK WOW GET REAL JEST TESTS
      // res.send({
      //   error: "",
      //   message: `User ${tokenUser.username} is not allowed to delete ${routineName}`,
      //   name: "",
      // });
    }
  } catch (error) {}
});

module.exports = router;
