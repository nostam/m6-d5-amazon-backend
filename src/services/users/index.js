const express = require("express")
const mongoose = require("mongoose")
const UserModel = require("./schema")
const { err, mongoErr } = require("../../lib/index")

const usersRouter = express.Router()

//GET /users
usersRouter.get("/", async (req, res, next) => {
    try {
        const users = await UserModel.find()
        res.send(users)
        
    }
    catch (error) {
        console.log(error)
        next(mongoErr)
    }
})

//GET /users/:id
usersRouter.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        const user = await UserModel.findById(id)
        if (user) {
            res.send(user)
        } else {
            const error = new Error()
            error.httpStatusCode = 404
            next(error)
        }
    } catch (error) {
        console.log(error)
        next("While reading users list a problem occurred!")
    }
})

//POST /users
usersRouter.post("/", async (req, res, next) => {
    console.log("post route")
    try {
        const newUser = new UserModel(req.body)
        const { _id } = await newUser.save()
        res.status(201).send(_id)
    } catch (error) {
        console.log(error)
        next(mongoErr(error))
    }
})

//PUT /users/:id
usersRouter.put("/:id", async (req, res, next) => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,  //new Parameters
        new: true,
        })
        if (user) {
            res.send(user)
        } else {
            const error = new Error(`user with id ${req.params.id} not found`)
            error.httpStatusCode = 404
            next(error)
        }
    } catch (error) {
        next(error)
    }
})

//DELETE /users/:id
usersRouter.delete("/:id", async (req, res, next) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id)
        if (user) {
            res.send("Deleted")
        } else {
            const error = new Error(`user with id ${req.params.id} not found`)
            error.httpStatusCode = 404
            next(error)
        }
    } catch (error) {
        next(error)
    }
})

//POST /users/:id/add-to-cart/:productId


module.exports = usersRouter