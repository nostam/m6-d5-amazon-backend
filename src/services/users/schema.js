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
        cart: [
            {
                product: { _id: Schema.Types.ObjectId, name: String, imageUrl: String },
                quantity: Number,
            },
        ],
    },
    { timestamps: true }
)

UserSchema.static("findProductInCart", async function (id, productId) {
    const isProductThere = await UserModel.findOne({
        _id: id,
        "cart._id": productId,
    })
    return isProductThere
})

UserSchema.static(
    "incrementCartQuantity",
    async function (id, productId, quantity) {
        await UserModel.findOneAndUpdate(
        {
            _id: id,
            "cart._id": productId,
        },
        { $inc: { "cart.$.quantity": quantity } }
    )
})

UserSchema.static("addproductToCart", async function (id, product) {
    await UserModel.findOneAndUpdate(
        { _id: id },
        {
        $addToSet: { cart: product },
        }
    )
})

UserSchema.static("calculateCartTotal", async function (id) {
    const { cart } = await UserModel.findById(id)
    return cart
        .map(product => product.price * product.quantity)
        .reduce((acc, el) => acc + el, 0)
})

const UserModel = model("User", UserSchema)
module.exports = UserModel
    
        