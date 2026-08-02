const sellerOnly = (req, res, next) => {

    if (req.user.type !== "seller") {
        return res.status(403).json({
            success: false,
            message: "Only sellers can access this resource",
            data: null,
        });
    }

    next();

};

module.exports = sellerOnly;
