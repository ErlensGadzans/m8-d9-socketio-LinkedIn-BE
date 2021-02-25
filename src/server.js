const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const services = require("./services");
require("dotenv").config();
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
const { errorMiddleware } = require("./errorMiddleware");
const { errorHandler } = require("./errorHandling");
const createSocketServer = require("../src/socket"); //1 STEP
const http = require("http"); //2 STEP

const server = express();
const httpServer = http.createServer(server); //3 STEP
createSocketServer(httpServer); //4 STEP

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
    httpServer.listen(port, () => {
      //5 STEP
      console.log("Server is running on port: ", port);
    })
  );
