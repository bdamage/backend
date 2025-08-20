/*
Start from terminal:
npm run db      // to start mongodb
npm run dev


*/

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

const PORT = process.env.PORT || 3500;

console.log("Booting up...");

connectDB();

//custom middleware for logs
app.use(logger);

//Handle options credendtials check - before CORS!
//and fetch cookies credebtuaks requirement
app.use(credentials);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//needed to extract form data in the payload
app.use(express.urlencoded({ extended: false }));

//build in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));
//app.use('/subdir',express.static(path.join(__dirname, '/public')));

//routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/events", require("./routes/api/events"));
app.use("/genai", require("./routes/api/genai"));
//app.use("/genai/generate", require("./routes/api/genai"));
app.use(verifyJWT);

//app.use('/subdir', require('./routes/subdir'));
app.use("/employees", require("./routes/api/employees"));
app.use("/users", require("./routes/api/users"));
app.use("/tickets", require("./routes/api/tickets"));
app.use("/knowledges", require("./routes/api/knowledges"));
app.use("/conversations", require("./routes/api/conversations"));

//404
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
});
