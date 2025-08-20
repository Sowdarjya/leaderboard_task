import { PointHistory } from "../models/pointHistory.model.js";
import { User } from "../models/user.model.js";

export const addPoints = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "userId is required", message: "Bad Request" });
    }

    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ error: "User not found", message: "Bad Request" });
    }

    const points = Math.ceil(Math.random() * 10);

    user.points += points;
    await user.save();

    await PointHistory.create({ userId, points });

    return res.status(200).json({ message: "Points added successfully", user });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};

export const getPointHistory = async (req, res) => {
  try {
    const pointHistory = await PointHistory.find().populate("userId", "name");
    return res.status(200).json({ pointHistory });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};
