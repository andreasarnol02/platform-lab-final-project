const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validation");

const {
    registerCustomer,
    loginCustomer,
    getProfile,
    registerSeller,
    loginSeller,
    getCurrentUser,
} = require("../controllers/authController");
const { customerRegistration, sellerRegistration, login } = require("./validators");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
});

router.use(authLimiter);
router.post("/customer/register", customerRegistration, validate, registerCustomer);
router.post("/customer/login", login, validate, loginCustomer);
router.post("/seller/register", sellerRegistration, validate, registerSeller);
router.post("/seller/login", login, validate, loginSeller);
router.get("/me", protect, getCurrentUser);

module.exports = router;
    
