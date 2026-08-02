process.env.JWT_SECRET = "integration-test-secret";

jest.mock("../src/models/cart", () => ({
  findOne: jest.fn(),
}));

const jwt = require("jsonwebtoken");
const request = require("supertest");
const Cart = require("../src/models/cart");
const app = require("../src/app");

const tokenFor = (type) =>
  jwt.sign({ sub: `${type}-1`, type }, process.env.JWT_SECRET);

describe("API route integration", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("serves the health response", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toMatch(/Marketplace API is running/);
  });

  test("rejects invalid auth input before the controller", async () => {
    const response = await request(app)
      .post("/api/auth/customer/login")
      .send({ email: "not-an-email", password: "" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "email" }),
        expect.objectContaining({ field: "password" }),
      ])
    );
  });

  test("keeps seller access out of customer cart routes", async () => {
    const response = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${tokenFor("seller")}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/customers/i);
  });

  test("keeps customer access out of seller product routes", async () => {
    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${tokenFor("customer")}`)
      .send({
        name: "Test product",
        description: "Test description",
        price: 1000,
        stock: 1,
        category: "Lainnya",
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/sellers/i);
  });

  test("uses the canonical checkout route and handles an empty cart", async () => {
    Cart.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue({ items: [] }),
    });

    const response = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${tokenFor("customer")}`)
      .send({
        shippingAddress: "Jakarta",
        paymentMethod: "Transfer",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "Cart is empty",
      })
    );
  });
});
