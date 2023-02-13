import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("get request");
  res.send({ test: "hi" });
});

export default router;
