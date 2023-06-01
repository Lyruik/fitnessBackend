const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    console.log('bro what')
    const routine = await client.query(
      `
        INSERT INTO routines ("creatorId", "isPublic", name, goal) VALUES ($1, $2, $3, $4)
        RETURNING *;
      `,
      [creatorId, isPublic, name, goal]
    );
    console.log(routine.rows[0], "routineeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    return routine;
  } catch (error) {}
}

async function getRoutineById(id) {}

async function getRoutinesWithoutActivities() {
  try {
    const routines = await client.query(`
      SELECT * FROM routines;
    `);
    console.log(routines.rows, 'excuse me');
    return routines.rows;
  } catch (error) {}
}

async function getAllRoutines() {}

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
