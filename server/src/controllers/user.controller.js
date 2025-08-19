import { User } from "../models/user.model.js";

export const addUser = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ error: "Name is required", message: "Bad Request" });
    }

    const newUser = await User.create({ name });
    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};
