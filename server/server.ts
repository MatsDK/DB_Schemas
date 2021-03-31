import express from "express";
import apiRouter from "./apiRouter";

const app = express();

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(3000);
