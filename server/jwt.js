const { AuthenticationError } = require("apollo-server-express");

const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;
const VERIFICATION_ERROR_MESSAGE = "You must be logged in!";

module.exports = {
  sign: (payload) => {
    return jwt.sign(payload, JWT_SECRET);
  },
  verifyUser: (token) => {
    if (!token) throw new AuthenticationError(VERIFICATION_ERROR_MESSAGE);

    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload.userId) {
      throw new AuthenticationError(VERIFICATION_ERROR_MESSAGE);
    }

    return payload;
  },
};
