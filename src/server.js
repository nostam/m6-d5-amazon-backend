const express = require("express");
const listEndPoints = require("express-list-endpoints");
const { join } = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

const productsRouter = require("./services/products");
const reviewsRouter = require("./services/reviews");
const usersRouter = require("./services/users");

const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  badRequestHandler,
  catchAllHandler,
} = require("./lib/errorHandlers");
const helmet = require("helmet");

const server = express();
const port = process.env.PORT;

/* const publiceFolderPath = join(__dirname, "../public")
server.use(express.static(publiceFolderPath)) */

const loggerMiddleware = (req, res, next) => {
  console.log(`${req.url} ${req.method} -- ${new Date()}`);
  next();
};
const whiteList =
  process.env.NODE_ENV === "production"
    ? [process.env.FE_URL_PROD, process.env.FE_URL_PROD1]
    : [process.env.FE_URL_DEV];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("NOT ALLOWED - CORS ISSUES"));
    }
  },
};

server.use(helmet());
server.use(cors(corsOptions));
server.use(express.json());
server.use(loggerMiddleware);
//Routes
server.use("/products", productsRouter);
server.use("/reviews", reviewsRouter);
server.use("/users", usersRouter);

//Error Handlers
server.use(notFoundHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(badRequestHandler);
server.use(catchAllHandler);

console.log(listEndPoints(server));

/* mongoose.connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(server.listen(port, () => {
    console.log("Running on Port", port)
    }))
.catch(error => console.log(error)) */

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(
    server.listen(port, () => {
      if (process.env.NODE_ENV === "production") {
        console.log("Running on cloud on port", port);
      } else {
        console.log("Running locally on port", port);
      }
    })
  )
  .catch((err) => console.log(err));
