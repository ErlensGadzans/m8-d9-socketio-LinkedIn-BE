const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const services = require("./services");
require("dotenv").config();
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

const { errorMiddleware } = require("./errorMiddleware");
const { errorHandler } = require("./errorHandling");

const server = express();

const port = process.env.PORT || 3001;

const loggerMiddleware = (req, res, next) => {
  console.log(`Logged ${req.url} ${req.method} -- ${new Date()}`);
  next();
};

server.use(cors());
server.use(express.json());
server.use(loggerMiddleware);

server.use("/api", services);

server.use(errorMiddleware);
server.use(errorHandler);

mongoose
  .connect(process.env.MONGO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Server is running on port: ", port);
    })
  );
