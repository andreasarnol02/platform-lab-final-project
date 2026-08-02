process.env.JWT_SECRET = "integration-test-secret";
process.env.CORS_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173";

jest.mock("../src/models/cart", () => ({
  findOne: jest.fn(),
}));

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const request = require("supertest");
const Cart = require("../src/models/cart");
jest.spyOn(mongoose, "startSession");
const app = require("../src/app");

const tokenFor = (type) =>
  jwt.sign({ sub: `${type}-1`, type }, process.env.JWT_SECRET);

describe("API route integration", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mongoose.startSession.mockResolvedValue({
      withTransaction: jest.fn(async (callback) => callback()),
      endSession: jest.fn().mockResolvedValue(undefined),
    });
  });

  test("serves the health response", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toMatch(/Marketplace API is running/);
    expect(response.body.data).toEqual({ status: "ok" });
  });

  test("allows the local 127.0.0.1 web origin", async () => {
    const response = await request(app)
      .get("/")
      .set("Origin", "http://127.0.0.1:5173");

    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://127.0.0.1:5173"
    );
  });

  test("returns a JSON 404 response for an unknown route", async () => {
    const response = await request(app).get("/api/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: "Route not found",
      data: null,
    });
  });

  test("returns a safe JSON 500 response for unexpected middleware errors", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const response = await request(app)
      .post("/api/auth/customer/login")
      .set("Content-Type", "application/json")
      .send("{");
    errorSpy.mockRestore();

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: "Internal server error",
      data: null,
    });
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
    const query = {
      session: jest.fn(),
      populate: jest.fn(),
    };
    query.session.mockReturnValue(query);
    query.populate.mockResolvedValue({ items: [] });
    Cart.findOne.mockReturnValue(query);

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
        data: null,
      })
    );
  });
});
