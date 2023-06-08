const express = require("express");
const {
  getAllActivities,
  createActivity,
  getActivityByName,
  getActivityById,
  updateActivity,
  getPublicRoutinesByActivity,
} = require("../db");
const router = express.Router();

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;
  try {
    const checkActivity = await getActivityById(activityId);
    if (checkActivity) {
      const response = await getPublicRoutinesByActivity({ id: activityId });
      res.send(response);
    } else {
      res.send({
        error: "Any<String>",
        message: `Activity ${activityId} not found`,
        name: "Any<String>",
      });
    }
  } catch (error) {}
});

// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const response = await getAllActivities();
    res.send(response);
  } catch (error) {}
});

// POST /api/activities
router.post("/", async (req, res, next) => {
  try {
    const checkName = await getActivityByName(req.body.name);
    if (!checkName) {
      const response = await createActivity(req.body);
      res.send(response);
    } else {
      res.send({
        error: "existingActity",
        message: "An activity with name Push Ups already exists",
        name: "existingActivity",
      });
    }
  } catch (error) {}
});

// PATCH /api/activities/:activityId
router.patch("/:activityId", async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;

  try {
    const checkActivityPatch = await getActivityById(activityId);
    const checkActivityName = await getActivityByName(name);
    if (!checkActivityName && checkActivityPatch) {
      let params = {
        id: activityId,
        name: name,
        description: description,
      };
      const response = await updateActivity({
        id: activityId,
        name: name,
        description: description,
      });
      res.send(response);
    } else if (!checkActivityPatch) {
      res.send({
        error: "invalidActvitiyId",
        message: `Activity ${activityId} not found`,
        name: "invalidActvitiyId",
      });
    } else if (checkActivityName) {
      res.send({
        error: "existingActivityName",
        message: `An activity with name ${name} already exists`,
        name: "existingActivityName",
      });
    }
  } catch (error) {}
});

module.exports = router;
