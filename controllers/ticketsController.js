const Ticket = require("../model/Ticket");
const User = require("../model/User");
const Knowledge = require("../model/Knowledge");
var mongoose = require("mongoose");

const TICKET_STATES = require("../config/constants");
const countersController = require("./countersController");

const getAllTickets = async (req, res) => {
  const tickets = await Ticket.find();
  if (!tickets) return res.status(204).json({ message: "No tickets found." });
  res.json(tickets);
};

const getAllTicketsBeta = async (req, res) => {
  const record = await Ticket.find();
};

const getTicket = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "ID parameter is required." });

  try {
    // const ticket = await Ticket.findOne({ _id: req.params.id }).exec();
    const id = req.params.id;
    const ticket = await Ticket.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "requestor",
          foreignField: "_id",
          as: "requestee",
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
          short_description: 1,
          state: 1,
          channel: 1,
          priority: 1,
          requestor: 1,
          assigned_to: 1,
          description: 1,
          requestee: {
            $cond: {
              if: { $eq: [null, "$requestee.username"] },
              then: "$$REMOVE",
              else: "$requestee.username",
            },
          },
          conversation: "$conversationee.text",
        },
      },
    ]);

    console.log(ticket);

    if (!ticket) {
      return res
        .status(400)
        .json({ message: `Ticket ID ${req.params.id} not found` });
    }

    res.json(ticket[0]);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: `catched Ticket ID ${req.params.id} not found` });
  }
};

const createNewTicket = async (req, res) => {
  if (!req?.body?.short_description) {
    return res.status(400).json({ message: "Short description are required." });
  }

  const n = await countersController.getNextSequence("ticket");

  const user = await User.findOne({ username: req.body.requestor }).exec();
  const assigned_user = await User.findOne({
    username: req.body.assigned_to,
  }).exec();

  try {
    const result = await Ticket.create({
      /*number: req.body.number,*/
      number: n,
      short_description: req.body.short_description,
      description: req.body.description,
      requestor: user,
      assigned_to: assigned_user,
      state: req.body.state,
      priority: req.body.priority,
      channel: req.body?.channel || TICKET_STATES.portal,
    });
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "error creating ticket :(" });
  }
};

const updateTicket = async (req, res) => {
  if (!req?.body?._id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  const ticket = await Ticket.findOne({ _id: req.body._id }).exec();
  if (!ticket) {
    return res
      .status(204)
      .json({ message: `Ticket ID ${req.body._id} not found` });
  }
  // if (req.body?.short_description)
  //  ticket.short_description = req.body.short_description;
  // if (req.body?.lastname) ticket.lastname = req.body.lastname;
  //  if (req.body?.email) ticket.email = req.body.email;
  console.log("short: " + req.body.short_description);
  console.log("State: " + req.body.state);

  for (const prop of Object.keys(req.body)) {
    if (prop in ticket) {
      console.log(`${prop} - ${ticket[prop]} = ${req.body[prop]}`);
      ticket[prop] = req.body[prop];
    }
  }

  const result = await ticket.save();

  //const result = await ticket.save();
  console.log(result);
  res.json(result);
};

const deleteTicket = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "ID parameter is required." });

  const ticket = await Ticket.findOne({ _id: req.params.id }).exec();
  if (!ticket) {
    return res
      .status(400)
      .json({ message: `Ticket ID ${req.body.id} not found` });
  }

  const result = await ticket.deleteOne({ _id: req.params.id });

  res.json(result);
};

const similarTickets = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "ID parameter is required." });

  const ticket = await Ticket.findOne({ _id: req.params.id }).exec();
  console.log(ticket);
  //$prompt = "Analys following csv data ".$csv." and return similar sentences items in pure json format and no content comments and minimum 1 or maximum 3 items and values short_description and ticket_no based on similar intent and short_description: ".$short_desc;
  const tickets = await Ticket.find({}, "number short_description");

  if (tickets) {
    // console.log(tickets);

    const msg = [
      {
        role: "system",
        content: "You are a helpful assistant and analyst.",
      },
      {
        role: "user",
        content:
          "Analys following json data " +
          JSON.stringify(tickets) +
          " and return similar sentences items in pure json format and no content comments and minimum 1 or maximum 3 items and values short_description and ticket_no based on similar intent and short_description: " +
          ticket.short_description,
      },
    ];
    console.log(msg);

    let response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 2700,
        messages: msg,
      }),
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + process.env.OPENAI_API_KEY,
      },
    });
    const data = await response.json();
    let output = data.choices[0].message.content;

    console.log(data.choices[0].message.content);
    output = output.replace("```json", "");
    output = output.replace("```", "");
    console.log(output);
    return res.json(JSON.parse(output));
  }

  res.json({ message: "Failure at fidning similiar ticket." });
};

const relatedArticle = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "ID parameter is required." });

  const ticket = await Ticket.findOne({ _id: req.params.id }).exec();
  console.log(ticket);
  //$prompt = "Analys following csv data ".$csv." and return similar sentences items in pure json format and no content comments and minimum 1 or maximum 3 items and values short_description and ticket_no based on similar intent and short_description: ".$short_desc;
  const knowledges = await Knowledge.find({}, "number title");

  if (knowledges) {
    const allKBs = JSON.stringify(knowledges);
    // console.log(tickets);

    const msg = [
      {
        role: "system",
        content: "You are a helpful assistant and analyst.",
      },
      {
        role: "user",
        content: `Analys following json data ${allKBs} and return related titles and similar intent based on the context:
          ${ticket.short_description}
           the output text should be pure json format no explaining text and with a maximum 3 items and with following values: title and number.`,
      },
    ];
    console.log(msg);

    let response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 2700,
        messages: msg,
      }),
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + process.env.OPENAI_API_KEY,
      },
    });
    const data = await response.json();
    let output = data.choices[0].message.content;

    console.log(data.choices[0].message.content);
    output = output.replace("```json", "");
    output = output.replace("```", "");
    console.log(output);
    return res.json(JSON.parse(output));
  }

  res.json({ message: "Failure at fidning similiar ticket." });
};

module.exports = {
  getAllTickets,
  getTicket,
  createNewTicket,
  updateTicket,
  deleteTicket,
  similarTickets,
  relatedArticle,
};
