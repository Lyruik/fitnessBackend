const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    await client.query(
      `
      INSERT INTO users (username, password) VALUES ($1, $2);
    `[(username, password)]
    );
  } catch (error) {}
}

async function getUser({ username, password }) {}

async function getUserById(userId) {}

async function getUserByUsername(userName) {}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
