const Cart = require("../models/cart");
const Product = require("../models/product");

const addToCart = async (req, res) => {
    try {

        const { productId, quantity } = req.body;

        // Cek apakah produk ada
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Cari cart milik customer
        let cart = await Cart.findOne({
            customer: req.user.id
        });

        // Kalau belum ada, buat baru
        if (!cart) {

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
                cart.items[itemIndex].quantity += quantity;

            } else {

                // Kalau belum ada, tambahkan item baru
                cart.items.push({
                    product: productId,
                    quantity
                });

            }

            await cart.save();

        }

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            data: cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

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

        res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            data: cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// Update item quantity in cart
const updateCartItem = async (req, res) => {
    try {

        const { quantity } = req.body;
        const { productId } = req.params;

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        const cart = await Cart.findOne({
            customer: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        item.quantity = quantity;

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            data: cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

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
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            data: cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    addToCart,
    getMyCart,
    updateCartItem,
    removeCartItem
};