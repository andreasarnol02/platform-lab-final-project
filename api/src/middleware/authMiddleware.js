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
            message: "Access denied. Token tidak ditemukan.",
            data: null,
        });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const id = decoded.sub || decoded.id;
        const type = decoded.type || decoded.role;

        if (!id || !["customer", "seller"].includes(type)) {
            return res.status(401).json({
                success: false,
                message: "Token tidak valid.",
                data: null,
            });
        }

        // Normalize legacy tokens while issuing the documented sub/type shape.
        req.user = { ...decoded, id, sub: id, role: type, type };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token tidak valid.",
            data: null,
        });
    }
};

module.exports = protect;
