import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("api");
});

router.post("/insertDoc", (req, res) => {
  res.send("api");
});

export default router;
