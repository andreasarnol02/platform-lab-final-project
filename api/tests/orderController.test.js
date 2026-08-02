jest.mock("../src/models/cart", () => ({
  findOne: jest.fn(),
}));

jest.mock("../src/models/order", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
}));

jest.mock("../src/models/product", () => ({
  findOneAndUpdate: jest.fn(),
}));

const mongoose = require("mongoose");
jest.spyOn(mongoose, "startSession");
const Cart = require("../src/models/cart");
const Order = require("../src/models/order");
const Product = require("../src/models/product");
const {
  checkout,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  updateOrderStatus,
} = require("../src/controllers/orderController");

const makeResponse = () => {
  const response = {
    status: jest.fn(),
    json: jest.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
};

const makeProduct = (id, seller, price, stock = 10) => ({
  _id: id,
  name: `Product ${id}`,
  seller: {
    toString: () => seller,
  },
  price,
  stock,
  isActive: true,
});

const makeCartQuery = (cart) => {
  const query = {
    session: jest.fn(),
    populate: jest.fn(),
  };
  query.session.mockReturnValue(query);
  query.populate.mockResolvedValue(cart);
  return query;
};

const makeOrderQuery = (order) => {
  const query = {
    populate: jest.fn(),
  };
  query.populate.mockResolvedValue(order);
  return query;
};

describe("order controller", () => {
  let session;

  beforeEach(() => {
    jest.resetAllMocks();
    session = {
      withTransaction: jest.fn(async (callback) => callback()),
      endSession: jest.fn().mockResolvedValue(undefined),
    };
    mongoose.startSession.mockResolvedValue(session);
  });

  test("creates one order per seller and clears the cart in one transaction", async () => {
    const productA = makeProduct("product-a", "seller-a", 100);
    const productB = makeProduct("product-b", "seller-a", 50);
    const productC = makeProduct("product-c", "seller-b", 80);
    const cart = {
      items: [
        { product: productA, quantity: 2 },
        { product: productB, quantity: 1 },
        { product: productC, quantity: 3 },
      ],
      save: jest.fn().mockResolvedValue(undefined),
    };

    Cart.findOne.mockReturnValue(makeCartQuery(cart));
    Product.findOneAndUpdate.mockResolvedValue({});
    Order.create.mockImplementation(async (payloads) =>
      payloads.map((payload, index) => ({
        _id: `order-${index + 1}`,
        ...payload,
      }))
    );

    const res = makeResponse();
    await checkout(
      {
        user: { id: "customer-1" },
        body: { shippingAddress: "Jakarta", paymentMethod: "Transfer" },
      },
      res
    );

    expect(mongoose.startSession).toHaveBeenCalledTimes(1);
    expect(session.withTransaction).toHaveBeenCalledTimes(1);
    expect(Order.create).toHaveBeenCalledTimes(1);
    expect(Order.create).toHaveBeenCalledWith(
      [
        {
          customer: "customer-1",
          seller: "seller-a",
          totalPrice: 250,
          shippingAddress: "Jakarta",
          paymentMethod: "Transfer",
          status: "PAID",
          items: [
            { product: "product-a", name: "Product product-a", quantity: 2, price: 100 },
            { product: "product-b", name: "Product product-b", quantity: 1, price: 50 },
          ],
        },
        {
          customer: "customer-1",
          seller: "seller-b",
          totalPrice: 240,
          shippingAddress: "Jakarta",
          paymentMethod: "Transfer",
          status: "PAID",
          items: [{ product: "product-c", name: "Product product-c", quantity: 3, price: 80 }],
        },
      ],
      { session }
    );
    expect(Product.findOneAndUpdate).toHaveBeenCalledTimes(3);
    expect(Product.findOneAndUpdate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ _id: "product-a", stock: { $gte: 2 } }),
      { $inc: { stock: -2 } },
      { new: true, session }
    );
    expect(cart.items).toEqual([]);
    expect(cart.save).toHaveBeenCalledWith({ session });
    expect(session.endSession).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.any(Array),
      })
    );
  });

  test("aborts the transaction when stock is insufficient without compensating writes", async () => {
    const product = makeProduct("product-a", "seller-a", 100, 2);
    const cart = {
      items: [{ product, quantity: 3 }],
      save: jest.fn(),
    };

    Cart.findOne.mockReturnValue(makeCartQuery(cart));
    Product.findOneAndUpdate.mockResolvedValue(null);

    const res = makeResponse();
    await checkout(
      {
        user: { id: "customer-1" },
        body: { shippingAddress: "Jakarta", paymentMethod: "COD" },
      },
      res
    );

    expect(session.withTransaction).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Stok tidak cukup untuk "Product product-a"',
      data: null,
    });
    expect(Order.create).not.toHaveBeenCalled();
    expect(cart.save).not.toHaveBeenCalled();
    expect(Product.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(session.endSession).toHaveBeenCalledTimes(1);
  });

  test("returns a safe server error when the transaction fails", async () => {
    const product = makeProduct("product-a", "seller-a", 100);
    const cart = {
      items: [{ product, quantity: 1 }],
      save: jest.fn(),
    };

    Cart.findOne.mockReturnValue(makeCartQuery(cart));
    Product.findOneAndUpdate.mockResolvedValue({});
    Order.create.mockRejectedValue(new Error("database failure"));

    const res = makeResponse();
    await checkout(
      {
        user: { id: "customer-1" },
        body: { shippingAddress: "Jakarta", paymentMethod: "COD" },
      },
      res
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
      data: null,
    });
    expect(cart.save).not.toHaveBeenCalled();
    expect(session.endSession).toHaveBeenCalledTimes(1);
  });

  test("queries only the currently authenticated seller's orders and exposes transitions", async () => {
    const query = {
      populate: jest.fn(),
      sort: jest.fn(),
    };
    const orders = [{ _id: "order-a", seller: "seller-a", status: "PAID" }];
    query.populate.mockReturnValue(query);
    query.sort.mockResolvedValue(orders);
    Order.find.mockReturnValue(query);

    const res = makeResponse();
    await getSellerOrders({ user: { id: "seller-a" } }, res);

    expect(Order.find).toHaveBeenCalledWith({ seller: "seller-a" });
    expect(query.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: [{ ...orders[0], allowedTransitions: ["PROCESSED", "CANCELLED"] }],
      })
    );
  });

  test("returns 403 for a different seller and 404 for a missing order", async () => {
    const foreignOrder = {
      _id: "order-a",
      seller: "seller-a",
      status: "PAID",
      save: jest.fn(),
    };
    Order.findById.mockResolvedValue(foreignOrder);

    const forbiddenResponse = makeResponse();
    await updateOrderStatus(
      {
        user: { id: "seller-b" },
        params: { id: "order-a" },
        body: { status: "PROCESSED" },
      },
      forbiddenResponse
    );

    expect(Order.findById).toHaveBeenCalledWith("order-a");
    expect(forbiddenResponse.status).toHaveBeenCalledWith(403);
    expect(foreignOrder.save).not.toHaveBeenCalled();

    Order.findById.mockResolvedValue(null);
    const missingResponse = makeResponse();
    await updateOrderStatus(
      {
        user: { id: "seller-b" },
        params: { id: "missing" },
        body: { status: "PROCESSED" },
      },
      missingResponse
    );

    expect(missingResponse.status).toHaveBeenCalledWith(404);
  });

  test("does not let a seller confirm payment on a pending order", async () => {
    const order = {
      _id: "order-a",
      seller: "seller-a",
      status: "PENDING",
      save: jest.fn(),
    };
    Order.findById.mockResolvedValue(order);

    const res = makeResponse();
    await updateOrderStatus(
      {
        user: { id: "seller-a" },
        params: { id: "order-a" },
        body: { status: "PAID" },
      },
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Status cannot change from "PENDING" to "PAID"',
      })
    );
    expect(order.save).not.toHaveBeenCalled();
  });

  test("returns 403 for a different customer and 404 for a missing order detail", async () => {
    const foreignOrder = { _id: "order-a", customer: "customer-a" };
    const query = makeOrderQuery(foreignOrder);
    Order.findById.mockReturnValue(query);

    const forbiddenResponse = makeResponse();
    await getOrderById(
      { user: { id: "customer-b" }, params: { id: "order-a" } },
      forbiddenResponse
    );

    expect(Order.findById).toHaveBeenCalledWith("order-a");
    expect(forbiddenResponse.status).toHaveBeenCalledWith(403);

    Order.findById.mockReturnValue(makeOrderQuery(null));
    const missingResponse = makeResponse();
    await getOrderById(
      { user: { id: "customer-b" }, params: { id: "missing" } },
      missingResponse
    );

    expect(missingResponse.status).toHaveBeenCalledWith(404);
  });

  test("returns API-derived transitions after a valid seller status update", async () => {
    const order = {
      _id: "order-a",
      seller: "seller-a",
      status: "PAID",
      save: jest.fn().mockResolvedValue(undefined),
    };
    Order.findById.mockResolvedValue(order);

    const res = makeResponse();
    await updateOrderStatus(
      {
        user: { id: "seller-a" },
        params: { id: "order-a" },
        body: { status: "PROCESSED" },
      },
      res
    );

    expect(order.save).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "PROCESSED",
          allowedTransitions: ["SHIPPED"],
        }),
      })
    );
  });

  test("returns the authenticated customer's order history", async () => {
    const query = {
      populate: jest.fn(),
      sort: jest.fn(),
    };
    const orders = [{ _id: "order-a", customer: "customer-a" }];
    query.populate.mockReturnValue(query);
    query.sort.mockResolvedValue(orders);
    Order.find.mockReturnValue(query);

    const res = makeResponse();
    await getMyOrders({ user: { id: "customer-a" } }, res);

    expect(Order.find).toHaveBeenCalledWith({ customer: "customer-a" });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: orders })
    );
  });
});
