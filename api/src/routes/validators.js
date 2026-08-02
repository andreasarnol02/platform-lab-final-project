const { body, param, query } = require("express-validator");

const email = body("email")
  .trim()
  .isEmail()
  .withMessage("A valid email is required")
  .normalizeEmail();

const password = body("password")
  .isString()
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters");

const customerRegistration = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  email,
  password,
  body("phone").optional().isString().trim(),
  body("address").optional().isString().trim(),
];

const sellerRegistration = [
  body("storeName").trim().notEmpty().withMessage("Store name is required"),
  body("ownerName").trim().notEmpty().withMessage("Owner name is required"),
  email,
  password,
  body("phone").optional().isString().trim(),
];

const login = [email, body("password").isString().notEmpty().withMessage("Password is required")];

const productFields = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price").isFloat({ min: 0 }).toFloat().withMessage("Price must be zero or greater"),
  body("stock").isInt({ min: 0 }).toInt().withMessage("Stock must be a non-negative integer"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("imageUrl")
    .optional({ values: "falsy" })
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Image URL must be a valid HTTP or HTTPS URL"),
];

const productUpdate = [
  body("name").optional().trim().notEmpty().withMessage("Product name cannot be empty"),
  body("description").optional().trim().notEmpty().withMessage("Description cannot be empty"),
  body("price").optional().isFloat({ min: 0 }).toFloat().withMessage("Price must be zero or greater"),
  body("stock").optional().isInt({ min: 0 }).toInt().withMessage("Stock must be a non-negative integer"),
  body("category").optional().trim().notEmpty().withMessage("Category cannot be empty"),
  body("imageUrl")
    .optional({ values: "falsy" })
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Image URL must be a valid HTTP or HTTPS URL"),
];

const mongoId = (field) => param(field).isMongoId().withMessage(`${field} must be a valid id`);

const addCartItem = [
  body("productId").isMongoId().withMessage("productId must be a valid id"),
  body("quantity").isInt({ min: 1 }).toInt().withMessage("Quantity must be at least 1"),
];

const updateCartItem = [
  mongoId("productId"),
  body("quantity").isInt({ min: 1 }).toInt().withMessage("Quantity must be at least 1"),
];

const checkout = [
  body("shippingAddress").trim().notEmpty().withMessage("Shipping address is required"),
  body("paymentMethod")
    .isIn(["COD", "Transfer"])
    .withMessage("Payment method must be COD or Transfer"),
];

const orderStatus = [
  mongoId("id"),
  body("status")
    .isIn(["PENDING", "PAID", "PROCESSED", "SHIPPED", "COMPLETED", "CANCELLED"])
    .withMessage("Invalid order status"),
];

const productQuery = [
  query("search").optional().isString().trim(),
  query("category").optional().isString().trim(),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be at least 1"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
];

module.exports = {
  customerRegistration,
  sellerRegistration,
  login,
  productFields,
  productUpdate,
  mongoId,
  addCartItem,
  updateCartItem,
  checkout,
  orderStatus,
  productQuery,
};
