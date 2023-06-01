const client = require("./client");
const bcrypt = require("bcrypt");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const hash = await bcrypt.hash(password, 10);
    const createduser = await client.query(
      `
      INSERT INTO users (username, password) VALUES ($1, $2)
      RETURNING id, username;
    `,
      [username, hash]
    );
    return createduser.rows[0];
  } catch (error) {}
}

async function getUser({ username, password }) {
  try {
    const fromDB = await client.query(
      `
      SELECT password FROM users WHERE username = ($1)
    `,
      [username]
    );
    const comparison = await bcrypt.compare(password, fromDB.rows[0].password);
    if (comparison) {
      const userInfo = await client.query(
        `
            SELECT id, username FROM users WHERE username = ($1)
          `,
        [username]
      );

      return userInfo.rows[0];
    } else {
      console.log("invalid");
    }
  } catch (error) {}
}

async function getUserById(userId) {
  try {
    const userInfo = await client.query(
      `
      SELECT id, username FROM users WHERE id = ($1);
    `,
      [userId]
    );
    return userInfo.rows[0];
  } catch (error) {}
}

async function getUserByUsername(userName) {
  try {
    const userInfo = await client.query(
      `
      SELECT username, password FROM users WHERE username = ($1)
    `,
      [userName]
    );
    return userInfo.rows[0];
  } catch (error) {}
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
