const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const customerOnly = require("../middleware/customerMiddleware");
const validate = require("../middleware/validation");

const {
    checkout,
    getMyOrders,
    getOrderById
} = require("../controllers/orderController");
const { checkout: checkoutValidator, mongoId } = require("./validators");

router.post(
  "/",
  protect,
  customerOnly,
  checkoutValidator,
  validate,
  checkout
);

router.get(
  "/",
  protect,
  customerOnly,
  getMyOrders
);

router.get(
  "/:id",
  protect,
  customerOnly,
  mongoId("id"),
  validate,
  getOrderById
);

module.exports = router;
