const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const customerOnly = require("../middleware/customerMiddleware");
const validate = require("../middleware/validation");

const {
    addToCart,
    getMyCart,
    updateCartItem: updateCartItemController,
    removeCartItem
} = require("../controllers/cartController");
const { addCartItem, updateCartItem: updateCartItemValidator, mongoId } = require("./validators");

router.get("/", protect, customerOnly, getMyCart);
router.post("/items", protect, customerOnly, addCartItem, validate, addToCart);
router.put("/items/:productId", protect, customerOnly, updateCartItemValidator, validate, updateCartItemController);
router.delete("/items/:productId", protect, customerOnly, mongoId("productId"), validate, removeCartItem);

module.exports = router;
