const Knowledge = require("../model/Knowledge");
const User = require("../model/User");
var mongoose = require("mongoose");

const KNOWLEDGE_STATES = require("../config/constants");
const countersController = require("./countersController");
const genaiController = require("./genaiController");

const getAllKnowledges = async (req, res) => {
  const knowledge = await Knowledge.find();
  if (!knowledge)
    return res.status(204).json({ message: "No knowledge article found." });
  res.json(knowledge);
};

const getKnowledge = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "ID parameter is required." });

  try {
    // const ticket = await Ticket.findOne({ _id: req.params.id }).exec();
    const id = req.params.id;
    const knowledge = await Knowledge.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerdisplay",
        },
      },
      {
        $lookup: {
          from: "conversations",
          localField: "_id",
          foreignField: "parent",
          as: "conversationee",
        },
      },
      // define which fields are you want to fetch
      {
        $project: {
          _id: 1,
          number: 1,
          title: 1,
          state: 1,
          content: 1,
          owner: 1,
          base: 1,
          category: 1,
          ownerdisplay: {
            $cond: {
              if: { $eq: [null, "$ownerdisplay.username"] },
              then: "$$REMOVE",
              else: "$ownerdisplay.username",
            },
          },
          conversation: "$conversationee.text",
        },
      },
    ]);

    console.log(knowledge);

    if (!knowledge) {
      return res
        .status(400)
        .json({ message: `Knowledge ID ${req.params.id} not found` });
    }

    res.json(knowledge[0]);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: `Throw Catched Knowledge ID ${req.params.id} not found`,
    });
  }
};

const createNewKnowledge = async (req, res) => {
  if (!req?.body?.title) {
    return res.status(400).json({ message: "Title are required." });
  }

  const seq = await countersController.getNextSequence("knowledge");

  const owner = await User.findOne({
    owner: req.body.owner,
  }).exec();

  try {
    const result = await Knowledge.create({
      /*number: req.body.number,*/
      number: seq,
      title: req.body.title,
      content: req.body.content,
      owner: owner,
      state: req.body?.state || KNOWLEDGE_STATES.editorial,
    });
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error creating Knowledge." });
  }
};

const updateKnowledge = async (req, res) => {
  if (!req?.body?._id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  const knowledge = await Knowledge.findOne({ _id: req.body._id }).exec();
  if (!knowledge) {
    return res
      .status(204)
      .json({ message: `Knowledge ID ${req.body._id} not found` });
  }
  // if (req.body?.short_description)
  //  ticket.short_description = req.body.short_description;
  // if (req.body?.lastname) ticket.lastname = req.body.lastname;
  //  if (req.body?.email) ticket.email = req.body.email;
  console.log("title: " + req.body.title);
  console.log("State: " + req.body.state);

  for (const prop of Object.keys(req.body)) {
    if (prop in knowledge) {
      console.log(`${prop} - ${knowledge[prop]} = ${req.body[prop]}`);
      knowledge[prop] = req.body[prop];
    }
  }

  const result = await knowledge.save();

  //const result = await ticket.save();
  console.log(result);
  res.json(result);
};

const deleteKnowledge = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "ID parameter is required." });

  const knowledge = await Knowledge.findOne({ _id: req.params.id }).exec();
  if (!knowledge) {
    return res
      .status(400)
      .json({ message: `Knowledge ID ${req.body.id} not found` });
  }

  const result = await knowledge.deleteOne({ _id: req.params.id });

  res.json(result);
};

const generateKnowledge = async (req, res) => {
  if (!req?.body?.title) {
    return res.status(400).json({ message: "Title parameter is required." });
  }
  console.log("Let's generate knowledge!!!");
  res.json(genaiController.generateKnowledge(req.body.title));
};

module.exports = {
  getAllKnowledges,
  getKnowledge,
  createNewKnowledge,
  updateKnowledge,
  deleteKnowledge,
  generateKnowledge,
};
