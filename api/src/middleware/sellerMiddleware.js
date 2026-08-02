const sellerOnly = (req, res, next) => {

    if (req.user.type !== "seller") {
        return res.status(403).json({
            success: false,
            message: "Only sellers can access this resource"
        });
    }

    next();

};

module.exports = sellerOnly;
