const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    parent: { type: Schema.Types.ObjectId, ref: "Ticket" },
    text: { type: String, required: true },
    private: { type: Boolean },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversations", conversationSchema);
