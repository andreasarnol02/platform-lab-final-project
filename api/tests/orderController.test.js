jest.mock("../src/models/cart", () => ({
  findOne: jest.fn(),
}));

jest.mock("../src/models/order", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  deleteMany: jest.fn(),
}));

jest.mock("../src/models/product", () => ({
  findOneAndUpdate: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

const Cart = require("../src/models/cart");
const Order = require("../src/models/order");
const Product = require("../src/models/product");
const {
  checkout,
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

describe("order controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("creates one order per seller and clears the cart", async () => {
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

    Cart.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(cart),
    });
    Product.findOneAndUpdate.mockResolvedValue({});
    Order.create.mockImplementation(async (payload) => ({
      _id: `order-${Order.create.mock.calls.length}`,
      ...payload,
    }));

    const req = {
      user: { id: "customer-1" },
      body: { shippingAddress: "Jakarta", paymentMethod: "Transfer" },
    };
    const res = makeResponse();

    await checkout(req, res);

    expect(Order.create).toHaveBeenCalledTimes(2);
    expect(Order.create).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        customer: "customer-1",
        seller: "seller-a",
        totalPrice: 250,
        items: [
          { product: "product-a", name: "Product product-a", quantity: 2, price: 100 },
          { product: "product-b", name: "Product product-b", quantity: 1, price: 50 },
        ],
      })
    );
    expect(Order.create).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        seller: "seller-b",
        totalPrice: 240,
        items: [{ product: "product-c", name: "Product product-c", quantity: 3, price: 80 }],
      })
    );
    expect(Product.findOneAndUpdate).toHaveBeenCalledTimes(3);
    expect(Product.findOneAndUpdate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ _id: "product-a", stock: { $gte: 2 } }),
      { $inc: { stock: -2 } },
      { new: true }
    );
    expect(cart.items).toEqual([]);
    expect(cart.save).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.any(Array),
      })
    );
  });

  test("rejects checkout before writes when stock is insufficient", async () => {
    const product = makeProduct("product-a", "seller-a", 100, 2);
    const cart = {
      items: [{ product, quantity: 3 }],
      save: jest.fn(),
    };

    Cart.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(cart),
    });
    Product.findOneAndUpdate.mockResolvedValue(null);

    const res = makeResponse();
    await checkout(
      {
        user: { id: "customer-1" },
        body: { shippingAddress: "Jakarta", paymentMethod: "COD" },
      },
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(Order.create).not.toHaveBeenCalled();
    expect(Product.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(cart.save).not.toHaveBeenCalled();
  });

  test("restores reserved stock when a later reservation fails", async () => {
    const productA = makeProduct("product-a", "seller-a", 100, 5);
    const productB = makeProduct("product-b", "seller-a", 50, 1);
    const cart = {
      items: [
        { product: productA, quantity: 2 },
        { product: productB, quantity: 2 },
      ],
      save: jest.fn(),
    };

    Cart.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(cart),
    });
    Product.findOneAndUpdate
      .mockResolvedValueOnce({ _id: "product-a" })
      .mockResolvedValueOnce(null);
    Product.findByIdAndUpdate.mockResolvedValue({});

    const res = makeResponse();
    await checkout(
      {
        user: { id: "customer-1" },
        body: { shippingAddress: "Jakarta", paymentMethod: "COD" },
      },
      res
    );

    expect(Order.create).not.toHaveBeenCalled();
    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith("product-a", {
      $inc: { stock: 2 },
    });
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("queries only the currently authenticated seller's orders", async () => {
    const query = {
      populate: jest.fn(),
      sort: jest.fn(),
    };
    const orders = [{ _id: "order-a", seller: "seller-a" }];
    query.populate.mockReturnValue(query);
    query.sort.mockResolvedValue(orders);
    Order.find.mockReturnValue(query);

    const res = makeResponse();
    await getSellerOrders({ user: { id: "seller-a" } }, res);

    expect(Order.find).toHaveBeenCalledWith({ seller: "seller-a" });
    expect(query.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: orders })
    );
  });

  test("does not allow a different seller to update an order", async () => {
    const order = {
      seller: { toString: () => "seller-a" },
      status: "PENDING",
      save: jest.fn(),
    };
    Order.findOne.mockResolvedValue(null);

    const res = makeResponse();
    await updateOrderStatus(
      {
        user: { id: "seller-b" },
        params: { id: "order-a" },
        body: { status: "PAID" },
      },
      res
    );

    expect(Order.findOne).toHaveBeenCalledWith({
      _id: "order-a",
      seller: "seller-b",
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(order.save).not.toHaveBeenCalled();
  });
});
