const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    registerCustomer,
    loginCustomer,
    getProfile,
    registerSeller,
    loginSeller
} = require("../controllers/authController");

router.post("/register/customer", registerCustomer);
router.post("/login/customer", loginCustomer);
router.get("/profile", protect, getProfile);
router.post("/register/seller", registerSeller);
router.post("/login/seller", loginSeller);

module.exports = router;
    
