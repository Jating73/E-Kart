const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true,
    },
    comment:{
        type: String,
        required: true,
    }
},{
    timestamps: true
})

const orderSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [
        {
            name: {type: String, required: true},
            qty: {type: Number, required: true},
            image: {type: String, required: true},
            price: {type: Number, required: true},
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            }

        }
    ],
    shippingAddress: {
        address: {type: String, required: true},
        city: {type: String, required: true},
        postalCode: {type: String, required: true},
        country: {type: String, required: true}
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentResult: {
        id: {type: String},
        status: {type: String},
        update_item: {type: String},
        email_address: {type: String}
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.00
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.00
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.00
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: String,
        required: true,
        default: " "
    },
    image:{
        type: String,
        required: false,
    },
    brand:{
        type: String,
        required: false
    },
    category:{
        type: String,
        required: false,
    },
    description:{
        type: String,
        required: false,
    },
    rating:{
        type: Number,
        required: true,
        default: 0
    },
    numReviews:{
        type: Number,
        required: true,
        default: 0
    },
    reviews: [reviewSchema],
    price:{
        type: Number,
        required: true,
        default: 0
    },
    countInStock:{
        type: Number,
        required: true,
        default: 0
    }

},{
    timestamps: true
})

const Order = mongoose.model('Order',orderSchema);

module.exports = Order;