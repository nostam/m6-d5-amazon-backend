const { Schema, model } = require("mongoose")

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        },
        address: {
            type: String,
        },
        ordersHistory: [
            {
                name: String,
                brand: String,
                price: Number,
                category:String,
                }
            ]
    },
    { timestamps: true }
)
    
const UserModel = model("User", UserSchema)
module.exports = UserModel
    
        