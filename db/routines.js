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
    STRING_AGG(CONCAT('{', '"id": ', a.id, ', ', '"name": "', a.name, '", ', '"count": ', ra.count, ', ', '"duration": ', ra.duration, '}'), '%') AS activities,
    r."creatorId"
    FROM routines r 
    JOIN routine_activities ra ON r.id=ra."routineId"
     JOIN activities a ON a.id=ra."activityId"
      JOIN users u ON u.id=r."creatorId"
       GROUP BY 1,2,3;
    `);
    routineInfo.rows[0].activities = routineInfo.rows[0].activities.split("%");
    // const newRow = await routineInfo.rows[0].activities.map((key) => {
    //   console.log(typeof key, "who are u");
    //   return JSON.parse(key);
    // });
    console.log(routineInfo.rows);
    routineInfo.rows[0].activities = await routineInfo.rows[0].activities.map(
      (key) => {
        return JSON.parse(key);
      }
    );
    console.log(routineInfo[0].activities, "that's not good");
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
