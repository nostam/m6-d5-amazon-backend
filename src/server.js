const express = require("express")
const listEndPoints = require("express-list-endpoints")
const { join } = require("path")
const cors = require("cors")
const mongoose = require("mongoose")

const {notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  badRequestHandler,
  catchAllHandler} = require ("./errorHandlers")
const productsRouter = require("./services/products")
const reviewsRouter = require("./services/reviews")

const server = express()
const port = process.env.PORT

const publiceFolderPath = join(__dirname, "../public")
server.use(express.static(publiceFolderPath))
server.use(express.json())

server.use(cors())

//Routes
server.use("/products", productsRouter)
server.use("/reviews", reviewsRouter)

//Error Handlers
server.use(notFoundHandler)
server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(badRequestHandler)
server.use(catchAllHandler)

console.log(listEndPoints)

/* mongoose.connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(server.listen(port, () => {
    console.log("Running on Port", port)
    }))
.catch(error => console.log(error)) */

mongoose.connect(process.env.MONGO_CONNECTION)
    .then(server.listen(port, () => {
    console.log("Server running on port", port)
    }))
.catch(err => console.log(err))