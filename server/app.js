const config = require("./utils/config");
const express = require("express");
const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const middleWare = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, { family: 4 });

if ((process.env.NODE_ENV = "production")) {
  logger.info("Express serving ../client/dist as static files");
  app.use(express.static("../client/dist"));
}
app.use(cors());
app.use(express.json());
if (1 || process.env.NODE_ENV !== "test") {
  morgan.token("rq-body", (req) => {
    return JSON.stringify(req.body);
  });
  app.use(
    morgan("tiny", {
      skip: (req) => {
        return req.method === "POST";
      },
    }),
  );
  app.use(
    morgan(
      ":method :url :status :res[content-length] - :response-time ms :rq-body",
      {
        skip: (req) => {
          return req.method !== "POST";
        },
      },
    ),
  );
}
app.use(middleWare.tokenExtractor);
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}
app.use(middleWare.unknownEndpoint);
app.use(middleWare.mongoErrorHandler);
module.exports = app;
