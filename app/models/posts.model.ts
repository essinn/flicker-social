import { db } from "../../db/db";

const fetch_posts = (post: any, done: any) => {
  const sql = "SELECT * FROM posts";

  db.get(sql, [], (err: Error, row: any) => {
    if (err) return done(err);

    return done(null, row);
  });
};

const fetch_post_by_id = (postId: any, done: any) => {
  const sql = "SELECT * FROM posts WHERE postId = ?";

  db.get(sql, [postId], (err: Error, row: any) => {
    if (err) return done(err);

    return done(null, row);
  });
};

const create_post = (
  post: { imageUrl: string; caption: string },
  userId: number,
  done: (err: Error | null, result?: any) => void
): void => {
  const sql = "INSERT INTO posts (imageUrl, caption, userId) VALUES (?, ?, ?)";

  db.run(
    sql,
    [post.imageUrl, post.caption, userId],
    function (this: any, err: Error | null) {
      if (err) return done(err);

      return done(null, { postId: this.lastID });
    }
  );
};

const update_post = (post: any, done: any) => {
  const sql = "UPDATE posts SET imageUrl = ?, caption = ? WHERE postId = ?";

  db.run(sql, [post.imageUrl, post.caption, post.postId], (err: Error) => {
    if (err) return done(err);

    return done(null, { postId: post.postId });
  });
};

const delete_post = (postId: any, done: any) => {
  const sql = "DELETE FROM posts WHERE postId = ?";

  db.run(sql, [postId], (err: Error) => {
    if (err) return done(err);

    return done(null, { postId });
  });
};

export { fetch_posts, fetch_post_by_id, create_post, update_post, delete_post };
