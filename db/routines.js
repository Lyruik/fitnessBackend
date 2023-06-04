const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const routine = await client.query(
      `
        INSERT INTO routines ("creatorId", "isPublic", name, goal) VALUES ($1, $2, $3, $4)
        RETURNING *;
      `,
      [creatorId, isPublic, name, goal]
    );
    return routine.rows[0];
  } catch (error) {}
}

async function getRoutineById(id) {}

async function getRoutinesWithoutActivities() {
  try {
    const routines = await client.query(`
      SELECT * FROM routines;
    `);
    return routines.rows;
  } catch (error) {}
}

async function getAllRoutines() {
  try {
    const routineInfo = await client.query(`
    SELECT DISTINCT
    r.name AS name,
    u.username AS "creatorName",
    r.id,
    r."isPublic", 
    r.goal,
    STRING_AGG(CONCAT('{', '"id": ', a.id, ', ', '"name": "', a.name, '", ', '"count": ', ra.count, ', ', '"duration": ', ra.duration, ', '
    '"description": "', a.description, '", ', '"routineId": ', ra."routineId", ', ', '"routineActivityId": ', ra.id, '}'), '%') AS activities,
    r."creatorId"
    FROM routines r 
    JOIN routine_activities ra ON r.id=ra."routineId"
     JOIN activities a ON a.id=ra."activityId"
      JOIN users u ON u.id=r."creatorId"
       GROUP BY 1,2,3;
    `);
    for (let i = 0; i < routineInfo.rows.length; i++) {
      routineInfo.rows[i].activities =
        routineInfo.rows[i].activities.split("%");
      routineInfo.rows[i].activities = await routineInfo.rows[i].activities.map(
        (key) => {
          console.log(key);
          return JSON.parse(key);
        }
      );
    }
    // console.log(routineInfo.rows[0].activities[0]);
    return routineInfo.rows;
  } catch (error) {}
}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
