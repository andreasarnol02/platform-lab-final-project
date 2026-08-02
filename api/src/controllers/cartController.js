const Cart = require("../models/cart");
const Product = require("../models/product");
const { sendServerError } = require("../utils/httpError");

const addToCart = async (req, res) => {
    try {

        const { productId } = req.body;
        const quantity = Number(req.body.quantity);

        // Cek apakah produk ada
        const product = await Product.findById(productId);

        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
                data: null,
            });
        }

        // Cari cart milik customer
        let cart = await Cart.findOne({
            customer: req.user.id
        });

        // Kalau belum ada, buat baru
        if (!cart) {
            if (quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Stok tidak cukup untuk "${product.name}" (tersisa ${product.stock})`,
                    data: null,
                });
            }

            cart = await Cart.create({
                customer: req.user.id,
                items: [
                    {
                        product: productId,
                        quantity
                    }
                ]
            });

        } else {

            // Cari apakah produk sudah ada di cart
            const itemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if (itemIndex > -1) {

                // Kalau sudah ada, tambah quantity
                const nextQuantity = cart.items[itemIndex].quantity + quantity;

                if (nextQuantity > product.stock) {
                    return res.status(400).json({
                        success: false,
                        message: `Stok tidak cukup untuk "${product.name}" (tersisa ${product.stock})`,
                        data: null,
                    });
                }

                cart.items[itemIndex].quantity = nextQuantity;

            } else {

                if (quantity > product.stock) {
                    return res.status(400).json({
                        success: false,
                        message: `Stok tidak cukup untuk "${product.name}" (tersisa ${product.stock})`,
                        data: null,
                    });
                }

                // Kalau belum ada, tambahkan item baru
                cart.items.push({
                    product: productId,
                    quantity
                });

            }

            await cart.save();

        }

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            data: cart
        });

    } catch (error) {

        return sendServerError(res, error);

    }
};

// Get my cart
const getMyCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            customer: req.user.id
        })
        .populate("items.product");

        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "Cart is empty",
                data: {
                    items: []
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            data: cart
        });

    } catch (error) {

        return sendServerError(res, error);

    }
};


// Update item quantity in cart
const updateCartItem = async (req, res) => {
    try {

        const quantity = Number(req.body.quantity);
        const { productId } = req.params;

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1",
                data: null,
            });
        }

        const cart = await Cart.findOne({
            customer: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
                data: null,
            });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart",
                data: null,
            });
        }

        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
                data: null,
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Stok tidak cukup untuk "${product.name}" (tersisa ${product.stock})`,
                data: null,
            });
        }

        item.quantity = quantity;

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            data: cart
        });

    } catch (error) {

        return sendServerError(res, error);

    }
};

//Remove item from cart
const removeCartItem = async (req, res) => {
    try {

        const { productId } = req.params;

        const cart = await Cart.findOne({
            customer: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
                data: null,
            });
        }

        const existingItemCount = cart.items.length;
        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        if (cart.items.length === existingItemCount) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart",
                data: null,
            });
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            data: cart
        });

    } catch (error) {

        return sendServerError(res, error);

    }
};


module.exports = {
    addToCart,
    getMyCart,
    updateCartItem,
    removeCartItem
};
