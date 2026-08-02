const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/carts", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Marketplace API is running 🚀"
    });
});

module.exports = app;