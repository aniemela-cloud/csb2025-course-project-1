const logger = require("./logger");
const config = require("./config");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const mongoErrorHandler = (error, request, response, next) => {
  logger.error("mongoErrorHandler handling:", error.message);
  if (error.name == "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name == "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response.status(400).json({
      error: "expected `username` to be unique",
    });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "invalid token",
    });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const tokenExtractor = (request, response, next) => {
  const authCookie = request.get("authorization");
  if (authCookie && authCookie.startsWith("Bearer ")) {
    request.token = authCookie.replace("Bearer ", "");
  }
  next();
};

const userExtractor = async (request, response, next) => {
  if (request.token) {
    decodedToken = jwt.verify(request.token, config.TOKEN_SECRET);
    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({
        error: "invalid token",
      });
    }
    const user = await User.findById(decodedToken.id);
    if (user) {
      request.user = user;
    }
  }
  next();
};

module.exports = {
  mongoErrorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
};
