const mongoose = require("mongoose");
const Cart = require("../models/cart");
const Order = require("../models/order");
const Product = require("../models/product");
const { sendServerError, sendWriteError } = require("../utils/httpError");
const {
    SELLER_ORDER_TRANSITIONS,
    normalizeOrderStatus,
} = require("../utils/orderStatus");
const { isOwner } = require("../utils/ownership");

class CheckoutError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}

const orderWithAllowedTransitions = (order) => {
    const data = typeof order?.toJSON === "function" ? order.toJSON() : order;
    const status = normalizeOrderStatus(data.status);

    return {
        ...data,
        status,
        allowedTransitions: SELLER_ORDER_TRANSITIONS[status] || [],
    };
};

const sendCheckoutError = (res, error) => res.status(error.statusCode).json({
    success: false,
    message: error.message,
    data: null,
});

const performCheckoutLogic = async (sessionOption = {}) => {
    const cartQuery = Cart.findOne({ customer: req.user.id }).populate("items.product");
    if (sessionOption.session) cartQuery.session(sessionOption.session);
    const cart = await cartQuery;

    if (!cart || cart.items.length === 0) {
        throw new CheckoutError("Cart is empty");
    }

    const groups = new Map();

    for (const item of cart.items) {
        if (!item.product || !item.product.isActive) {
            throw new CheckoutError("One of the products is no longer available");
        }

        const sellerId = item.product.seller.toString();
        if (!groups.has(sellerId)) {
            groups.set(sellerId, []);
        }
        groups.get(sellerId).push(item);
    }

    for (const item of cart.items) {
        const findOptions = {
            _id: item.product._id,
            isActive: true,
            stock: { $gte: item.quantity },
        };
        const updateOptions = { new: true, ...sessionOption };
        const product = await Product.findOneAndUpdate(
            findOptions,
            { $inc: { stock: -item.quantity } },
            updateOptions
        );

        if (!product) {
            throw new CheckoutError(`Stok tidak cukup untuk "${item.product.name}"`);
        }
    }

    const orderPayloads = [...groups].map(([sellerId, items]) => ({
        customer: req.user.id,
        seller: sellerId,
        items: items.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
        })),
        totalPrice: items.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        ),
        shippingAddress,
        paymentMethod,
        status: "PAID",
    }));

    const createdOrders = await Order.create(orderPayloads, sessionOption);
    cart.items = [];
    await cart.save(sessionOption);
    return createdOrders;
};

const checkout = async (req, res) => {
    let session;
    let createdOrders = [];

    try {
        const { shippingAddress, paymentMethod } = req.body;

        try {
            session = await mongoose.startSession();
            await session.withTransaction(async () => {
                const cart = await Cart.findOne({ customer: req.user.id })
                    .session(session)
                    .populate("items.product");

                if (!cart || cart.items.length === 0) {
                    throw new CheckoutError("Cart is empty");
                }

                const groups = new Map();

                for (const item of cart.items) {
                    if (!item.product || !item.product.isActive) {
                        throw new CheckoutError("One of the products is no longer available");
                    }

                    const sellerId = item.product.seller.toString();
                    if (!groups.has(sellerId)) {
                        groups.set(sellerId, []);
                    }
                    groups.get(sellerId).push(item);
                }

                for (const item of cart.items) {
                    const product = await Product.findOneAndUpdate(
                        {
                            _id: item.product._id,
                            isActive: true,
                            stock: { $gte: item.quantity },
                        },
                        { $inc: { stock: -item.quantity } },
                        { new: true, session }
                    );

                    if (!product) {
                        throw new CheckoutError(`Stok tidak cukup untuk "${item.product.name}"`);
                    }
                }

                const orderPayloads = [...groups].map(([sellerId, items]) => ({
                    customer: req.user.id,
                    seller: sellerId,
                    items: items.map((item) => ({
                        product: item.product._id,
                        name: item.product.name,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                    totalPrice: items.reduce(
                        (total, item) => total + item.product.price * item.quantity,
                        0
                    ),
                    shippingAddress,
                    paymentMethod,
                    status: "PAID",
                }));

                createdOrders = await Order.create(orderPayloads, { session });
                cart.items = [];
                await cart.save({ session });
            });
        } catch (txnError) {
            if (txnError instanceof CheckoutError) throw txnError;
            // Fallback for standalone MongoDB instance without replica set support
            const cart = await Cart.findOne({ customer: req.user.id }).populate("items.product");
            if (!cart || cart.items.length === 0) {
                throw new CheckoutError("Cart is empty");
            }
            const groups = new Map();
            for (const item of cart.items) {
                if (!item.product || !item.product.isActive) {
                    throw new CheckoutError("One of the products is no longer available");
                }
                const sellerId = item.product.seller.toString();
                if (!groups.has(sellerId)) groups.set(sellerId, []);
                groups.get(sellerId).push(item);
            }
            for (const item of cart.items) {
                const product = await Product.findOneAndUpdate(
                    { _id: item.product._id, isActive: true, stock: { $gte: item.quantity } },
                    { $inc: { stock: -item.quantity } },
                    { new: true }
                );
                if (!product) {
                    throw new CheckoutError(`Stok tidak cukup untuk "${item.product.name}"`);
                }
            }
            const orderPayloads = [...groups].map(([sellerId, items]) => ({
                customer: req.user.id,
                seller: sellerId,
                items: items.map((item) => ({
                    product: item.product._id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
                totalPrice: items.reduce((total, item) => total + item.product.price * item.quantity, 0),
                shippingAddress,
                paymentMethod,
                status: "PAID",
            }));
            createdOrders = await Order.create(orderPayloads);
            cart.items = [];
            await cart.save();
        }

        return res.status(201).json({
            success: true,
            message: "Checkout successful",
            data: createdOrders,
        });
    } catch (error) {
        if (error instanceof CheckoutError) {
            return sendCheckoutError(res, error);
        }

        return sendServerError(res, error);
    } finally {
        if (session) {
            try {
                await session.endSession();
            } catch (error) {
                console.error(error);
            }
        }
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user.id })
            .populate("items.product")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders,
        });
    } catch (error) {
        return sendServerError(res, error);
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("items.product");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
                data: null,
            });
        }

        if (!isOwner(order.customer, req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to access this order",
                data: null,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: order,
        });
    } catch (error) {
        return sendServerError(res, error);
    }
};

const getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.user.id })
            .populate("items.product")
            .populate("customer", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders.map(orderWithAllowedTransitions),
        });
    } catch (error) {
        return sendServerError(res, error);
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
                data: null,
            });
        }

        if (!isOwner(order.seller, req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this order",
                data: null,
            });
        }

        const currentStatus = normalizeOrderStatus(order.status);
        const nextStatus = normalizeOrderStatus(req.body.status);
        const validStatuses = SELLER_ORDER_TRANSITIONS[currentStatus] || [];

        if (!validStatuses.includes(nextStatus)) {
            return res.status(400).json({
                success: false,
                message: `Status cannot change from "${currentStatus}" to "${nextStatus}"`,
                data: null,
            });
        }

        order.status = nextStatus;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: orderWithAllowedTransitions(order),
        });
    } catch (error) {
        return sendWriteError(res, error);
    }
};

module.exports = {
    checkout,
    getMyOrders,
    getOrderById,
    getSellerOrders,
    updateOrderStatus,
};
