import { db } from "../../db/db";
import crypto from "crypto";

const getHash = (password: string, salt: string) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
};

const setToken = (id: number, done: any) => {
  const token = crypto.randomBytes(16).toString("hex");

  const sql = "UPDATE users SET sessionToken = ? WHERE userId = ?";

  db.run(sql, [token, id], function (err: Error) {
    if (err) return done(err);

    return done(null, token);
  });
};

const getToken = (id: number, done: any) => {
  const sql = "SELECT sessionToken FROM users WHERE userId = ?";

  db.get(sql, [id], (err: Error, row: any) => {
    if (err) return done(err);

    return done(null, row ? row.sessionToken : null);
  });
};

const getTokenById = (token: string, done: any) => {
  const sql = "SELECT userId FROM users WHERE sessionToken = ?";

  db.get(sql, [token], (err: Error, row: any) => {
    if (err) return done(err);

    return done(null, row ? row.userId : null);
  });
};

const create_user = (user: any, done: any) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = getHash(user.password, salt);

  const sql =
    "INSERT INTO users (username, bio, email, password, salt) VALUES (?, ?, ?, ?, ?)";
  const values = [user.username, user.bio, user.email, hash, salt];

  db.run(sql, values, function (this: any, err: Error) {
    if (err) return done(err);

    return done(null, { userId: this.lastID });
  });
};

const login_user = (email: string, password: string, done: any) => {
  const sql = "SELECT userId, password, salt FROM users WHERE email = ?";

  db.get(sql, [email], (err: Error, row: any) => {
    if (err) return done(err);

    if (!row) return done(null, false);

    const hash = getHash(password, row.salt);

    if (hash !== row.password) return done(null, false);

    setToken(row.userId, (err: Error, token: string) => {
      if (err) return done(err);

      return done(null, token);
    });
  });
};

const logout_user = (token: string | any, done: any) => {
  const sql = "UPDATE users SET sessionToken = '' WHERE sessionToken = ?";

  db.run(sql, [token], (err: Error) => {
    return done(err);
  });
};

export {
  create_user,
  login_user,
  logout_user,
  getToken,
  setToken,
  getTokenById,
};
