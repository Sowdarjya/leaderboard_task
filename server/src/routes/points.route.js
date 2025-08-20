import express from "express";
import {
  addPoints,
  getPointHistory,
} from "../controllers/points.controller.js";

const router = express.Router();

router.post("/add-points", addPoints);
router.get("/get-points-history", getPointHistory);

export default router;
