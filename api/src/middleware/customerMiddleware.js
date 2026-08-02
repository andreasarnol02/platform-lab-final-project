const customerOnly = (req, res, next) => {

    if (req.user.type !== "customer") {
        return res.status(403).json({
            success: false,
            message: "Only customers can access this resource",
            data: null,
        });
    }

    next();

};

module.exports = customerOnly;
