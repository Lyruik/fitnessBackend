const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const routActivities = await client.query(
      `
      INSERT INTO routine_activities ("routineId", "activityId", count, duration) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
      [routineId, activityId, count, duration]
    );
    return routActivities.rows[0];
  } catch (error) {}
}

async function getRoutineActivityById(id) {
  try {
    const response = await client.query(
      `
      SELECT * FROM routine_activities WHERE id = ($1)
    `,
      [id]
    );
    return response.rows[0];
  } catch (error) {}
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const response = await client.query(
      `
      SELECT a.id, a.name, a.description FROM routine_activities ra
      JOIN activities a ON a.id=ra."activityId"
      WHERE ra."routineId" = ($1);
    `,
      [id]
    );
    return response.rows;
  } catch (error) {}
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [routineActivities],
    } = await client.query(
      `
      UPDATE routine_activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return routineActivities;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const response = await client.query(
      `
      DELETE FROM routine_activities WHERE id = ($1)
      RETURNING *;
    `,
      [id]
    );
    return response.rows[0];
  } catch (error) {}
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const response = await client.query(
      `
      SELECT r."creatorId" FROM routine_activities ra
      JOIN routines r ON r.id=ra."routineId"
      WHERE ra.id = ($1);
    `,
      [routineActivityId]
    );
    if (response.rows[0].creatorId === userId) {
      return true;
    } else {
      return false;
    }
  } catch (error) {}
}

async function getRoutineNamefromRoutineActivityId(id) {
  try {
    const response = await client.query(
      `
      SELECT r.name FROM routines r
        JOIN routine_activities ra ON r.id=ra."routineId"
        WHERE ra."routineId" = ($1);
    `,
      [id]
    );
    return response.rows[0].name;
  } catch (error) {}
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
  getRoutineNamefromRoutineActivityId,
};
