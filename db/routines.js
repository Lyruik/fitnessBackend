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
          return JSON.parse(key);
        }
      );
    }
    return routineInfo.rows;
  } catch (error) {}
}

async function getAllPublicRoutines() {
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
      WHERE "isPublic" = true
       GROUP BY 1,2,3;
    `);
    for (let i = 0; i < routineInfo.rows.length; i++) {
      routineInfo.rows[i].activities =
        routineInfo.rows[i].activities.split("%");
      routineInfo.rows[i].activities = await routineInfo.rows[i].activities.map(
        (key) => {
          return JSON.parse(key);
        }
      );
    }
    return routineInfo.rows;
  } catch (error) {}
}

async function getAllRoutinesByUser({ username }) {
  try {
    const routineInfo = await client.query(
      `
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
    WHERE u.username = ($1)
     GROUP BY 1,2,3;
  `,
      [username]
    );
    for (let i = 0; i < routineInfo.rows.length; i++) {
      routineInfo.rows[i].activities =
        routineInfo.rows[i].activities.split("%");
      routineInfo.rows[i].activities = await routineInfo.rows[i].activities.map(
        (key) => {
          return JSON.parse(key);
        }
      );
    }
    return routineInfo.rows;
  } catch (error) {}
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const routineInfo = await client.query(
      `
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
  WHERE u.username = ($1) AND "isPublic" = true
   GROUP BY 1,2,3;
`,
      [username]
    );
    for (let i = 0; i < routineInfo.rows.length; i++) {
      routineInfo.rows[i].activities =
        routineInfo.rows[i].activities.split("%");
      routineInfo.rows[i].activities = await routineInfo.rows[i].activities.map(
        (key) => {
          return JSON.parse(key);
        }
      );
    }
    return routineInfo.rows;
  } catch (error) {}
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const routineInfo = await client.query(
      `
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
WHERE a.id = ($1) AND "isPublic" = true
 GROUP BY 1,2,3;
`,
      [id]
    );
    for (let i = 0; i < routineInfo.rows.length; i++) {
      routineInfo.rows[i].activities =
        routineInfo.rows[i].activities.split("%");
      routineInfo.rows[i].activities = await routineInfo.rows[i].activities.map(
        (key) => {
          return JSON.parse(key);
        }
      );
    }
    return routineInfo.rows;
  } catch (error) {}
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [routines],
    } = await client.query(
      `
      UPDATE routines
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return routines;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    const deletedRoutine = await client.query(`
    DELETE FROM routine_activities WHERE "routineId" = ($1);
    `,
      [id]
    );
    const deletedRoutineActivity = await client.query(`
    DELETE FROM routines WHERE id = ($1);
    `,
      [id]
    );
  } catch (error) {}
}

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
