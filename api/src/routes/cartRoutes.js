const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const customerOnly = require("../middleware/customerMiddleware");

const {
    addToCart,
    getMyCart,
    updateCartItem,
    removeCartItem
} = require("../controllers/cartController");

router.post("/", protect, customerOnly, addToCart);
router.get("/", protect, customerOnly, getMyCart);
router.put("/:productId", protect, customerOnly, updateCartItem);
router.delete("/:productId", protect, customerOnly, removeCartItem);

module.exports = router;