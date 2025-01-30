import express, { Request, Response } from "express";
import usersRouter from "./app/routes/users.route";
import postsRouter from "./app/routes/posts.route";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "Alive" });
});

app.use("/api/", usersRouter);
app.use("/api/", postsRouter);

app.use((req: Request, res: Response) => {
  res.sendStatus(404);
});

app.listen(PORT, () => console.log("Server running on port: " + PORT));
