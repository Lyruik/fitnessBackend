const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
    const activity = await client.query(
      `
      INSERT INTO activities (name, description) VALUES ($1, $2)
      RETURNING *;
    `,
      [name, description]
    );
    return activity.rows[0];
  } catch (error) {}
}

async function getAllActivities() {
  try {
    const activities = await client.query(`
      SELECT * FROM activities;
    `);
    return activities.rows;
  } catch (error) {}
}

async function getActivityById(id) {
  try {
    const activityInfo = await client.query(
      `
      SELECT * FROM activities WHERE id = ($1)
    `,
      [id]
    );
    return activityInfo.rows[0];
  } catch (error) {}
}

async function getActivityByName(name) {
  try {
    const activityInfo = await client.query(
      `
    SELECT * FROM activities WHERE name = ($1)
  `,
      [name]
    );
    return activityInfo.rows[0];
  } catch (error) {}
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const fieldType = Object.keys(fields).map((key) => key);
  if (fieldType[0] === "name") {
    const newData = Object.values(fields)[0];
    const updatedInfo = await client.query(
      `
      UPDATE activities
      SET name = ($1)
      WHERE id = ($2)
      RETURNING *;
    `,
      [newData, id]
    );
    return updatedInfo.rows[0];
  } else if (fieldType[0] === "description") {
    const newData = Object.values(fields)[0];
    const updatedInfo = await client.query(
      `
      UPDATE activities
      SET description = ($1)
      WHERE id = ($2)
      RETURNING *;
    `,
      [newData, id]
    );
    return updatedInfo.rows[0];
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
