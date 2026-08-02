const jwt = require("jsonwebtoken");

const generateToken = (id, type) => {
    return jwt.sign(
        { sub: id.toString(), type },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES || "7d",
        }
    );
};

module.exports = generateToken;
