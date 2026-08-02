const Product = require("../models/product");

// Create Product
const createProduct = async (req, res) => {
    try {

        const {
            name,
            description,
            price,
            stock,
            category,
            images
        } = req.body;

        const product = await Product.create({

            name,
            description,
            price,
            stock,
            category,
            images,

            seller: req.user.id

        });

        res.status(201).json({

            success: true,
            message: "Product created successfully",

            data: product

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }
};

//Get Products

const getProducts = async (req, res) => {
    try {

        const products = await Product.find({ isActive: true })
            .populate("seller", "storeName ownerName");

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get Product by ID
const getProductById = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id)
            .populate("seller", "storeName ownerName email phone");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

//update product
const updateProduct = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Pastikan hanya seller pemilik yang boleh update
        if (product.seller.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this product"
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Pastikan hanya seller pemilik yang bisa menghapus
        if (product.seller.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this product"
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {

    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
    