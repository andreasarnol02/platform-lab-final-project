const mongoose = require("mongoose");
const { ORDER_STATUSES, normalizeOrderStatus } = require("../utils/orderStatus");

const orderSchema = new mongoose.Schema(
    {

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
            index: true
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                name: {
                    type: String,
                    required: true,
                    trim: true,
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
            enum: ORDER_STATUSES,
            default: "PENDING",
            get: normalizeOrderStatus,
            set: normalizeOrderStatus,
        }

    },
    {
        timestamps: true,
        toJSON: {
            getters: true,
            transform(_document, value) {
                value.status = normalizeOrderStatus(value.status);
                delete value.__v;
                return value;
            },
        },
    }
);

module.exports = mongoose.model("Order", orderSchema);
