import expres from "express";
import { addUser, getUsers } from "../controllers/user.controller.js";

const router = expres.Router();

router.post("/add-user", addUser);
router.get("/get-users", getUsers);

export default router;
