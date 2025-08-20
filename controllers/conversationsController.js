const Conversation = require("../model/Conversation");
const User = require("../model/User");
var mongoose = require("mongoose");

/*
    parent: { type: Schema.Types.ObjectId, ref: "Ticket" },
    text: { type: String, required: true },
    private: { type: Number },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
*/

const getAllConversations = async (req, res) => {
  const conversations = await Conversation.find();
  if (!conversations)
    return res.status(204).json({ message: "No conversations found" });
  res.json(conversations);
};

const getConversation = async (req, res) => {
  if (!req.params?.id)
    return res.status(400).json({ message: "ID parameter is required." });
  try {
    const parent = req.params.id;

    /*  const conversations = await Conversation.find(
      { parent: parent },
      [text, createdAt],
      {
        skip: 0, // Starting Row
        limit: 10, // Ending Row
        sort: {
          createdAt: -1, //Sort by Date Added DESC
        },
      }
    );
    */
    const conversations = await Conversation.find({ parent: parent }).sort({
      createdAt: -1,
    });
    if (!conversations)
      return res.status(204).json({ message: "No conversations found" });

    console.log(conversations);
    res.json(conversations);
  } catch (err) {
    return res.status(204).json({ message: "No conversations found" });
  }
};

const createNewConversation = async (req, res) => {
  if (!req?.body?.text || !req?.body?.parent)
    return res
      .status(400)
      .json({ message: "Text, private and parent are required." });

  const user = req?.user;

  const currentUser = await User.findOne({ username: user }).exec();

  if (!currentUser) return res.status(400).json({ message: "User not found." });

  //  let _private = 0;
  // if (req.body.private) _private = 1;

  let data = {
    parent: new mongoose.Types.ObjectId(req.body.parent),
    text: req.body.text,
    private: req.body.private,
    createdBy: currentUser,
  };

  try {
    const result = await Conversation.create(data);

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error creating conversation." });
  }
};

module.exports = {
  getAllConversations,
  getConversation,
  createNewConversation,
};
