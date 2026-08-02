const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true
                },

                price: {
                    type: Number,
                    required: true
                }
            }
        ],

        totalPrice: {
            type: Number,
            required: true
        },

        shippingAddress: {
            type: String,
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "Transfer"],
            required: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Paid",
                "Shipped",
                "Completed",
                "Cancelled"
            ],
            default: "Pending"
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);