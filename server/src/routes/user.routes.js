import expres from "express";
import { addUser } from "../controllers/user.controller.js";

const router = expres.Router();

router.post("/add-user", addUser);

export default router;
