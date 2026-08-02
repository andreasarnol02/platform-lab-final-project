const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const sellerRoutes = require("./routes/sellerRoutes");

// Middleware
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(null, false);
    },
}));
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/seller", sellerRoutes);

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Marketplace API is running 🚀",
        data: { status: "ok" },
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        data: null,
    });
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null,
    });
});

module.exports = app;
