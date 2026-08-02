const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSED",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
];

const LEGACY_STATUS_MAP = {
  Pending: "PENDING",
  Paid: "PAID",
  Processed: "PROCESSED",
  Shipped: "SHIPPED",
  Completed: "COMPLETED",
  Cancelled: "CANCELLED",
};

const normalizeOrderStatus = (status) => LEGACY_STATUS_MAP[status] || status;

const ORDER_TRANSITIONS = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["PROCESSED", "CANCELLED"],
  PROCESSED: ["SHIPPED"],
  SHIPPED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

module.exports = {
  ORDER_STATUSES,
  ORDER_TRANSITIONS,
  normalizeOrderStatus,
};
