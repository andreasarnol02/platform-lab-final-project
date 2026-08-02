const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const customerOnly = require("../middleware/customerMiddleware");

const {
    checkout,
    getMyOrders,
    getOrderById
} = require("../controllers/orderController");

router.post(
  "/checkout",
  protect,
  customerOnly,
  checkout
);

router.get(
  "/my-orders",
  protect,
  customerOnly,
  getMyOrders
);

router.get(
  "/:id",
  protect,
  customerOnly,
  getOrderById
);

module.exports = router;