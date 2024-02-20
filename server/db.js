const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
  "./db/budget.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Connected to the database");
    }
    console.log("Connection established");
  }
);

module.exports = db;
