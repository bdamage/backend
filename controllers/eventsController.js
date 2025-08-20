let clients = [];
const { v4: uuid } = require("uuid");

const sendToAllUsers = async (data) => {
  for (let i = 0; i < clients.length; i++) {
    clients[i].res.write(`data: ${JSON.stringify(data)}\n\n`);
    // clients[i].res.flush();
  }
};

const handleEvents = async (req, res) => {
  //On client, also delete the accessToken.
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.se;

  const clientId = uuid();
  clients.push({
    id: clientId,
    res,
  });

  console.log(`${clientId} - Connection opened`);
  //console.log(clients);
  req.on("close", () => {
    console.log(`${clientId} - Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
    //console.log(clients);
  });

  /*setInterval(() => {
    console.log("event pump!");
    res.write(`data: ${JSON.stringify({ message: "Hello from server!" })}\n\n`);
  }, 8000);*/
};

module.exports = { handleEvents, sendToAllUsers };
