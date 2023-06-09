const express = require("express");
const {
  getAllRoutines,
  createRoutine,
  updateRoutine,
  getAllRoutinesByUser,
  getRoutineById,
  destroyRoutine,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
} = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils");

// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const response = await getAllRoutines();
    res.send(response);
  } catch (error) {}
});

// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  try {
    const response = await createRoutine({
      creatorId: req.user.id,
      isPublic: isPublic,
      name: name,
      goal: goal,
    });
    res.send(response);
  } catch (error) {}
});

// PATCH /api/routines/:routineId
router.patch("/:routineId", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const { routineId } = req.params;
  try {
    const checkRoutineOwner = await getRoutineById(routineId);
    if (checkRoutineOwner.creatorId === req.user.id) {
      const response = await updateRoutine({
        id: routineId,
        isPublic: isPublic,
        name: name,
        goal: goal,
      });
      res.send(response);
    } else {
      const checkRoutineOwner = await getRoutineById(routineId);
      res.status(403);
      res.send({
        error: "",
        message: `User ${req.user.username} is not allowed to update ${checkRoutineOwner.name}`,
        name: "",
      });
    }
  } catch (error) {}
});

// DELETE /api/routines/:routineId
router.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  try {
    const checkRoutineOwner = await getRoutineById(routineId);
    if (checkRoutineOwner.creatorId === req.user.id) {
      const delRoutine = await destroyRoutine(routineId);
      res.send(checkRoutineOwner);
    } else {
      const checkRoutineOwner = await getRoutineById(routineId);
      res.status(403);
      res.send({
        error: "",
        message: `User ${req.user.username} is not allowed to delete ${checkRoutineOwner.name}`,
        name: "",
      });
    }
  } catch (error) {}
});

// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", requireUser, async (req, res, next) => {
  try {
    const checkDupe = await getRoutineActivitiesByRoutine({
      id: req.body.routineId,
    });
    console.log(checkDupe);
    if (!checkDupe[0]) {
      console.log("the good");
      const response = await addActivityToRoutine(req.body);
      console.log(response);
      res.send(response);
    } else {
      console.log(checkDupe, "the bad");
      res.status(403);
      res.send({
        error: "",
        message: `Activity ID ${req.body.activityId} already exists in Routine ID ${req.body.routineId}`,
        name: "",
      });
    }
  } catch (error) {}
});

module.exports = router;
