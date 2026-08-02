const { body, param, query } = require("express-validator");

const email = body("email")
  .isString()
  .withMessage("A valid email is required")
  .bail()
  .trim()
  .isEmail()
  .withMessage("A valid email is required")
  .normalizeEmail();

const password = body("password")
  .isString()
  .withMessage("Password is required")
  .bail()
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters");

const customerRegistration = [
  body("name")
    .isString()
    .withMessage("Name is required")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
  email,
  password,
  body("phone").optional().isString().withMessage("Phone must be a string").bail().trim(),
  body("address").optional().isString().withMessage("Address must be a string").bail().trim(),
];

const sellerRegistration = [
  body("storeName")
    .isString()
    .withMessage("Store name is required")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Store name is required"),
  body("ownerName")
    .isString()
    .withMessage("Owner name is required")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Owner name is required"),
  email,
  password,
  body("phone").optional().isString().withMessage("Phone must be a string").bail().trim(),
];

const login = [
  email,
  body("password")
    .isString()
    .withMessage("Password is required")
    .bail()
    .notEmpty()
    .withMessage("Password is required"),
];

const productFields = [
  body("name")
    .isString()
    .withMessage("Product name is required")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),
  body("description")
    .isString()
    .withMessage("Description is required")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Description is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be zero or greater")
    .bail()
    .toFloat(),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer")
    .bail()
    .toInt(),
  body("category")
    .isString()
    .withMessage("Category is required")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Category is required"),
  body("imageUrl")
    .isString()
    .withMessage("Image URL is required")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Image URL is required")
    .bail()
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Image URL must be a valid HTTP or HTTPS URL"),
];

const productUpdate = [
  body("name")
    .optional()
    .isString()
    .withMessage("Product name must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be zero or greater")
    .bail()
    .toFloat(),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer")
    .bail()
    .toInt(),
  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),
  body("imageUrl")
    .optional()
    .isString()
    .withMessage("Image URL must be a string")
    .bail()
    .trim()
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Image URL must be a valid HTTP or HTTPS URL"),
];

const mongoId = (field) =>
  param(field)
    .isString()
    .withMessage(`${field} must be a valid id`)
    .bail()
    .isMongoId()
    .withMessage(`${field} must be a valid id`);

const addCartItem = [
  body("productId")
    .isString()
    .withMessage("productId must be a valid id")
    .bail()
    .isMongoId()
    .withMessage("productId must be a valid id"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1")
    .bail()
    .toInt(),
];

const updateCartItem = [
  mongoId("productId"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1")
    .bail()
    .toInt(),
];

const checkout = [
  body("shippingAddress")
    .isString()
    .withMessage("Shipping address is required")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Shipping address is required"),
  body("paymentMethod")
    .isString()
    .withMessage("Payment method must be COD or Transfer")
    .bail()
    .isIn(["COD", "Transfer"])
    .withMessage("Payment method must be COD or Transfer"),
];

const orderStatus = [
  mongoId("id"),
  body("status")
    .isString()
    .withMessage("Invalid order status")
    .bail()
    .isIn(["PENDING", "PAID", "PROCESSED", "SHIPPED", "COMPLETED", "CANCELLED"])
    .withMessage("Invalid order status"),
];

const productQuery = [
  query("search").optional().isString().withMessage("Search must be a string").bail().trim(),
  query("category").optional().isString().withMessage("Category must be a string").bail().trim(),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be at least 1")
    .bail()
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .bail()
    .toInt(),
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
