const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    let token;

    // Ambil token dari header Authorization
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    // Kalau tidak ada token
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied. Token tidak ditemukan."
        });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Simpan informasi user ke request
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token tidak valid."
        });
    }
};

module.exports = protect;