const TICKET_CHANNEL_STATES = {
  portal: 0,
  chat: 1,
  email: 2,
  phone: 3,
};

const KNOWLEDGE_STATES = {
  editoral_state: 0,
  awaiting_approval: 1,
  published: 2,
  expired: 3,
  decomissioned: 4,
};

module.exports = { TICKET_CHANNEL_STATES, KNOWLEDGE_STATES };
