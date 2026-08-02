const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const sellerOnly = require("../middleware/sellerMiddleware");
const validate = require("../middleware/validation");

const {
    getMyProducts,
    getMyProductById,
} = require("../controllers/productController");

const {
    getSellerOrders,
    updateOrderStatus
} = require("../controllers/orderController");
const { mongoId, orderStatus } = require("./validators");

router.get("/products", protect, sellerOnly, getMyProducts);
router.get("/products/:id", protect, sellerOnly, mongoId("id"), validate, getMyProductById);
router.get("/orders", protect, sellerOnly, getSellerOrders);
router.put("/orders/:id/status", protect, sellerOnly, orderStatus, validate, updateOrderStatus);

module.exports = router;
