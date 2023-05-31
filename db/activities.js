const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
}

async function getAllActivities() {
  try {
    const activities = await client.query(`
      SELECT * FROM actvities;
    `)
    console.log('how', activities.rows)
    return activities.rows;
  } catch (error) {
    
  }
}

async function getActivityById(id) {}

async function getActivityByName(name) {}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
