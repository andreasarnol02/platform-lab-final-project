const Cart = require("../models/cart");
const Order = require("../models/order");
const Product = require("../models/product");
const { sendServerError, sendWriteError } = require("../utils/httpError");
const { ORDER_TRANSITIONS, normalizeOrderStatus } = require("../utils/orderStatus");

const restoreStock = async (reserved) => {
    await Promise.all(
        reserved.map(({ productId, quantity }) =>
            Product.findByIdAndUpdate(productId, {
                $inc: { stock: quantity },
            })
        )
    );
};

const deleteCreatedOrders = async (orders) => {
    const ids = orders.map((order) => order._id).filter(Boolean);
    if (ids.length > 0) {
        await Order.deleteMany({ _id: { $in: ids } });
    }
};

const checkout = async (req, res) => {
    const reserved = [];
    const createdOrders = [];

    try {
        const { shippingAddress, paymentMethod } = req.body;
        const cart = await Cart.findOne({ customer: req.user.id }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        const groups = new Map();

        for (const item of cart.items) {
            if (!item.product || !item.product.isActive) {
                return res.status(400).json({
                    success: false,
                    message: "One of the products is no longer available",
                });
            }

            const sellerId = item.product.seller.toString();
            if (!groups.has(sellerId)) {
                groups.set(sellerId, []);
            }
            groups.get(sellerId).push(item);
        }

        // Reserve stock atomically so concurrent checkouts cannot oversell.
        for (const item of cart.items) {
            const product = await Product.findOneAndUpdate(
                {
                    _id: item.product._id,
                    isActive: true,
                    stock: { $gte: item.quantity },
                },
                { $inc: { stock: -item.quantity } },
                { new: true }
            );

            if (!product) {
                await restoreStock(reserved);
                return res.status(400).json({
                    success: false,
                    message: `Stok tidak cukup untuk "${item.product.name}"`,
                });
            }

            reserved.push({ productId: item.product._id, quantity: item.quantity });
        }

        for (const [sellerId, items] of groups) {
            const totalPrice = items.reduce(
                (total, item) => total + item.product.price * item.quantity,
                0
            );

            const order = await Order.create({
                customer: req.user.id,
                seller: sellerId,
                items: items.map((item) => ({
                    product: item.product._id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
                totalPrice,
                shippingAddress,
                paymentMethod,
                // Payment is simulated, so checkout immediately confirms the order.
                status: "PAID",
            });

            createdOrders.push(order);
        }

        cart.items = [];
        await cart.save();

        return res.status(201).json({
            success: true,
            message: "Checkout successful",
            data: createdOrders,
        });
    } catch (error) {
        try {
            await restoreStock(reserved);
            await deleteCreatedOrders(createdOrders);
        } catch (rollbackError) {
            console.error(rollbackError);
        }

        return sendServerError(res, error);
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
        const order = await Order.findOne({
            _id: req.params.id,
            customer: req.user.id,
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
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
            data: orders,
        });
    } catch (error) {
        return sendServerError(res, error);
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            seller: req.user.id,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const currentStatus = normalizeOrderStatus(order.status);
        const nextStatus = normalizeOrderStatus(req.body.status);
        const validStatuses = ORDER_TRANSITIONS[currentStatus] || [];

        if (!validStatuses.includes(nextStatus)) {
            return res.status(400).json({
                success: false,
                message: `Status cannot change from "${currentStatus}" to "${nextStatus}"`,
            });
        }

        order.status = nextStatus;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order,
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
