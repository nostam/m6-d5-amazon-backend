const { Schema, model } = require("mongoose")

const ReviewSchema = new Schema({
    
    
    comment: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        min: 1,
        max: 5,
        default: 1,
        required: true,
    }
})

const ReviewModel = model("Review", ReviewSchema)
module.exports = ReviewModel