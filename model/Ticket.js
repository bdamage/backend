const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*

		$this->id = $this->formData['id'];
		$item['short_description'] = $this->formData['short_description'];
		$item['description'] = $this->formData['description'];
		$item['requestor'] = $this->formData['requestor'];
		$item['assigned_to'] = $this->formData['assigned_to'];
		$item['state']     = intval($this->formData['state']);
		$item['priority']     = intval($this->formData['priority']);
		$item['channel']     = intval($this->formData['channel']);

*/

const ticketSchema = new Schema(
  {
    number: { type: String },
    short_description: { type: String, required: true },
    description: { type: String },
    state: { type: Number, default: 0 },
    type: { type: Number },
    channel: { type: Number, default: 0 },
    priority: { type: Number, default: 4 },
    resolution_notes: { type: String },
    resolution_code: { type: Number },
    reassign_count: { type: Number, default: 0 },
    requestor: { type: Schema.Types.ObjectId, ref: "User" },
    assigned_to: { type: Schema.Types.ObjectId, ref: "User" },
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation" },
    parent: { type: Schema.Types.ObjectId, ref: "Ticket" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
