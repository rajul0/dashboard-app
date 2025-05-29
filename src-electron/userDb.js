const PouchDB = require("pouchdb");
const bcrypt = require("bcrypt");

const db = new PouchDB("users");

async function saveUser(username, password) {
  const userId = `user:${username}`;

  try {
    await db.get(userId);
    return;
  } catch (err) {
    if (err.status === 404) {
      const passwordHash = await bcrypt.hash(password, 10);
      await db.put({
        _id: userId,
        username,
        passwordHash,
      });
    } else {
      throw err;
    }
  }
}

async function getUser(username) {
  const userId = `user:${username}`;
  try {
    return await db.get(userId);
  } catch (err) {
    return null;
  }
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Initiate user
(async () => {
  try {
    await saveUser("user@aemenersol.com", "Test@123");
  } catch (err) {
    console.error("Failed to create default user:", err.message);
  }
})();

module.exports = { saveUser, getUser, verifyPassword };
