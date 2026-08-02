const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const sellerOnly = require("../middleware/sellerMiddleware");
const validate = require("../middleware/validation");


const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");
const { productFields, productUpdate, mongoId, productQuery } = require("./validators");


router.get("/", productQuery, validate, getProducts);
router.get("/:id", mongoId("id"), validate, getProductById);
router.post("/", protect, sellerOnly, productFields, validate, createProduct);
router.put("/:id", protect, sellerOnly, mongoId("id"), productUpdate, validate, updateProduct);
router.delete("/:id", protect, sellerOnly, mongoId("id"), validate, deleteProduct);


module.exports = router;
