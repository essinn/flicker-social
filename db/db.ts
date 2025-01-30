const sqlite3 = require("sqlite3").verbose();

export const db = new sqlite3.Database("db/db.sqlite", (err: Error) => {
  if (err) console.error(err.message);
  console.log("Connected to the SQLite database.");

  db.run("DROP TABLE IF EXISTS users", (err: Error) => {
    if (err) {
      console.error("Error dropping users table:", err);
    } else {
      console.log("Users table dropped successfully.");

      // Now recreate the table with the correct schema
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
            userId INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(50) UNIQUE,
            bio TEXT,
            email TEXT UNIQUE,
            password TEXT,
            salt TEXT,
            sessionToken TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )`,
        (err: Error) => {
          if (err) console.error("Error creating users table:", err);
          else console.log("Users table created successfully.");
        }
      );
    }
  });

  db.run(
    `CREATE TABLE IF NOT EXISTS posts (
        postId INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER FOREIGN KEY,
        imageUrl TEXT, 
        caption TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )`,
    (err: Error) => {
      if (err) console.log("Posts table already created");
      console.log("Posts table created");
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS comments (
        commentId INTEGER PRIMARY KEY AUTOINCREMENT,
        postId INTEGER FOREIGN KEY,
        userId INTEGER FOREIGN KEY,
        comment TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )`,
    (err: Error) => {
      if (err) console.log("Comments table already created");
      console.log("Comments table created");
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS likes (
            likeId INTEGER PRIMARY KEY AUTOINCREMENT,
            postId INTEGER FOREIGN KEY,
            userId INTEGER FOREIGN KEY,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
            )`,
    (err: Error) => {
      if (err) console.log("Likes table already created");
      console.log("Likes table created");
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS followers (
            followerId INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER FOREIGN KEY,
            followerUserId INTEGER FOREIGN KEY,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
            )`,
    (err: Error) => {
      if (err) console.log("Followers table already created");
      console.log("Followers table created");
    }
  );
});
