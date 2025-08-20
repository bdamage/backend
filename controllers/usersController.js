const User = require("../model/User");

const getAllUsers = async (req, res) => {
  const user = await User.find({}, { username: 1, _id: 1 });
  if (!user) return res.status(204).json({ message: "No users found." });
  res.json(user);
};

const getUser = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "ID parameter is required." });

  const user = await User.findOne(
    { _id: req.params.id },
    { username: 1, _id: 1 }
  ).exec();

  if (!user) {
    return res
      .status(400)
      .json({ message: `User ID ${req.params.id} not found` });
  }

  res.json(user);
};

module.exports = {
  getAllUsers,
  getUser,
};
