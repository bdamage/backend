const User = require("../model/User");

const handleLogout = async (req, res) => {
  //On client, also delete the accessToken.

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204); //No content

  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204); //Success
  }

  //Delete refreshToken in db

  foundUser.refreshToken = "";

  // true returns the doc after the update
  const result = await foundUser.save();

  console.log(result);

  if (
    req.headers["user-agent"] ===
      "Thunder Client (https://www.thunderclient.com)" ||
    req.headers["user-agent"] === "EchoapiRuntime/1.1.0"
  )
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None" });
  else
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  res.sendStatus(204);
};

module.exports = { handleLogout };
