const Product = require("../models/product");
const { sendServerError, sendWriteError } = require("../utils/httpError");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const productPayload = (body) => ({
    name: body.name,
    description: body.description,
    price: body.price,
    stock: body.stock,
    category: body.category,
    imageUrl: body.imageUrl || "",
});

const createProduct = async (req, res) => {
    try {
        const product = await Product.create({
            ...productPayload(req.body),
            seller: req.user.id,
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        return sendWriteError(res, error);
    }
};

const getProducts = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 24);
        const filter = { isActive: true };

        if (req.query.search) {
            filter.name = {
                $regex: escapeRegex(req.query.search.trim()),
                $options: "i",
            };
        }

        if (req.query.category) {
            filter.category = req.query.category.trim();
        }

        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate("seller", "storeName ownerName")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Product.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return sendServerError(res, error);
    }
};

const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user.id })
            .populate("seller", "storeName ownerName")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products,
        });
    } catch (error) {
        return sendServerError(res, error);
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            isActive: true,
        }).populate("seller", "storeName ownerName");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product,
        });
    } catch (error) {
        return sendServerError(res, error);
    }
};

const getMyProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            seller: req.user.id,
        }).populate("seller", "storeName ownerName");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product,
        });
    } catch (error) {
        return sendServerError(res, error);
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            seller: req.user.id,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        Object.assign(product, productPayload({
            ...product.toObject(),
            ...req.body,
        }));
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });
    } catch (error) {
        return sendWriteError(res, error);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            seller: req.user.id,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        product.isActive = false;
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product deactivated successfully",
        });
    } catch (error) {
        return sendWriteError(res, error);
    }
};

module.exports = {
    createProduct,
    getProducts,
    getMyProducts,
    getProductById,
    getMyProductById,
    updateProduct,
    deleteProduct,
};
