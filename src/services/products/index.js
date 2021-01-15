const express = require("express")
const mongoose = require("mongoose")
const q2m = require("query-to-mongo")
const ProductModel = require("./schema")
const { err, mongoErr } = require("../../lib/index")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../../cloudinary")



const productsRouter = express.Router()

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "marketplace",
    },
})

const cloudinaryMulter = multer({ storage: storage })

productsRouter.post("/",
    cloudinaryMulter.single("image"),
    async (req, res, next) => {
        try {
        const newProduct = new ProductModel(req.body)
        const { _id } = await newProduct.save()
        res.status(201).send(_id)
    } catch (error) {
        console.log(error)
        next(mongoErr(error))
    }
            //img: req.file.path,
        })

//GET /products
/* productsRouter.get("/", async (req, res, next) => {
    try {
        const products = await ProductModel.find()
        res.send(products)
        
    }
    catch (error) {
        console.log(error)
        next(mongoErr)
    }
}) */

//GET /products with query
productsRouter.get("/", async (req, res, next) => {
    try {
        const query = q2m(req.query)
        console.log(query)
        const totProducts = await ProductModel.countDocuments(query.criteria)
        const products = await ProductModel.find(query.criteria, query.options.fields)
        .skip(query.options.skip)
        .limit(query.options.limit)
        .sort(query.options.sort)
        .populate("user", { _id: 0, name: 1})
        res.send({links: query.links("/products",totProducts), products})
    } catch (error) {
        console.log(error)
        next (error)
    }
})

//GET /products/:id
productsRouter.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        const product = await ProductModel.findById(id).populate("user")
        //need to .populate("user")
        if (product) {
            res.send(product)
        } else {
            const error = new Error()
            error.httpStatusCode = 404
            next(error)
        }
    } catch (error) {
        console.log(error)
        next("While reading products list a problem occurred!")
    }
})


//POST /products
productsRouter.post("/", async (req, res, next) => {
    console.log("post route")
    try {
        const newProduct = new ProductModel(req.body)
        const { _id } = await newProduct.save()
        res.status(201).send(_id)
    } catch (error) {
        console.log(error)
        next(mongoErr(error))
    }
})

//PUT /products/:id
productsRouter.put("/:id", async (req, res, next) => {
    try {
        const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,  //new Parameters
        new: true,
        })
        if (product) {
            res.send(product)
        } else {
            const error = new Error(`product with id ${req.params.id} not found`)
            error.httpStatusCode = 404
            next(error)
        }
    } catch (error) {
        next(error)
    }
})

//DELETE /products/:id
productsRouter.delete("/:id", async (req, res, next) => {
    try {
        const product = await ProductModel.findByIdAndDelete(req.params.id)
        if (product) {
            res.send("Deleted")
        } else {
            const error = new Error(`product with id ${req.params.id} not found`)
            error.httpStatusCode = 404
            next(error)
        }
    } catch (error) {
        next(error)
    }
})

//GET /products/:id/reviews 
productsRouter.get("/:id/reviews", async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.id, {
        reviews: 1,
        _id: 0,
        })
        res.send(product)
    } catch (error) {
        next(error)
    }
})

//GET /products/:id/reviews/:reviewId 
productsRouter.get("/:id/reviews/:reviewId", async (req, res, next) => {
    try {
        const { reviews } = await ProductModel.findOne(
        {
            _id: mongoose.Types.ObjectId(req.params.id)
        },
        {
            _id:0,
            reviews: {
            $elemMatch: {_id: mongoose.Types.ObjectId(req.params.reviewId)},
            }
        }
        )

        if (reviews && reviews.length > 0) {
            res.send(reviews[0])
        } else {
            next()
        }
        
    } catch (error) {
        next(error)
    }
})

//POST /products/:id/reviews
productsRouter.post("/:id/reviews", async (req, res, next) => {
    try { 
        const reviewsProduct = await ProductModel.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
            reviews: {
                ...req.body,
            },
            },
        }
        );
        res.status(201).send(reviewsProduct);
    } catch (error) {
        next(error)
    }
})

//PUT /products/:id/reviews/:reviewId 
productsRouter.put("/:id/reviews/:reviewId", async (req, res, next) => {
    try { 
        const { reviews }  = await ProductModel.findOne(
        {
            _id: mongoose.Types.ObjectId(req.params.id),
        },
        {
            _id: 0,
            reviews: {
            $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
            },
        }
        )
        console.log(reviews)
        if (reviews && reviews.length > 0) {
            const reviewToReplace = { ...reviews[0].toObject(), ...req.body }
            console.log(reviewToReplace)
            mongoose.set('useFindAndModify', false);
            const modifiedReview = await ProductModel.findOneAndUpdate(
                {
                _id: mongoose.Types.ObjectId(req.params.id),
                "reviews._id": mongoose.Types.ObjectId(req.params.reviewId),
                },
                { $set: { "reviews.$": reviewToReplace } },
                {
                runValidators: true,
                new: true,
                } 
            )
            console.log(modifiedReview)
            res.send(modifiedReview)
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

//DELETE /products/:id/reviews/:reviewId 
productsRouter.delete("/:id/reviews/:reviewId", async (req, res, next) => {
    try {
        const modifiedReview = await ProductModel.findByIdAndUpdate(
        req.params.id,
        {
            $pull: {
            reviews: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
            },
        },
        {
            new: true,
        }
        )
        res.send(modifiedReview)
    } catch (error) {
        console.log(error)
        next(error)
    }
})



module.exports = productsRouter