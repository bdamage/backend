const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*

		$this->id = $this->formData['id'];
		$item['title'] = $this->formData['title'];
		$item['content'] = $this->formData['content'];
		$item['owner'] = $this->formData['owner'];
		$item['state']     = intval($this->formData['state']);
*/

const knowledgeSchema = new Schema(
  {
    number: { type: String },
    title: { type: String, required: true },
    content: { type: String },
    version: { type: String },
    state: { type: Number, default: 0 },
    type: { type: Number },
    base: { type: String, default: "General" },
    category: { type: String, default: "IT" },
    helpfull: { type: Number },
    expire: { type: Date, default: new Date("2100-01-01") },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Knowledge", knowledgeSchema);
