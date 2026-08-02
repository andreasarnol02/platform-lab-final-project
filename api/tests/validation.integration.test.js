const express = require("express");
const { matchedData } = require("express-validator");
const request = require("supertest");
const validate = require("../src/middleware/validation");
const {
  checkout,
  productFields,
  productQuery,
  productUpdate,
} = require("../src/routes/validators");

const app = express();
app.use(express.json());
app.post("/products", productFields, validate, (req, res) => {
  res.status(200).json({ success: true, message: "ok", data: req.body });
});
app.put("/products/:id", productUpdate, validate, (req, res) => {
  res.status(200).json({ success: true, message: "ok", data: req.body });
});
app.get("/products", productQuery, validate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "ok",
    data: matchedData(req, { locations: ["query"] }),
  });
});
app.post("/checkout", checkout, validate, (req, res) => {
  res.status(200).json({ success: true, message: "ok", data: req.body });
});

describe("request validation", () => {
  test("requires a valid HTTP or HTTPS image URL on product creation", async () => {
    const missingImage = await request(app).post("/products").send({
      name: "Product",
      description: "Description",
      price: "100",
      stock: "2",
      category: "Category",
    });
    expect(missingImage.status).toBe(400);

    const invalidImage = await request(app).post("/products").send({
      name: "Product",
      description: "Description",
      price: "100",
      stock: "2",
      category: "Category",
      imageUrl: "ftp://example.com/product.jpg",
    });
    expect(invalidImage.status).toBe(400);
    expect(invalidImage.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "imageUrl" }),
      ])
    );
  });

  test("validates a provided update URL and coerces numeric product fields", async () => {
    const invalidUpdate = await request(app)
      .put("/products/507f1f77bcf86cd799439011")
      .send({ imageUrl: "not-a-url" });
    expect(invalidUpdate.status).toBe(400);

    const validUpdate = await request(app)
      .put("/products/507f1f77bcf86cd799439011")
      .send({ price: "100.50", stock: "3", imageUrl: "https://example.com/product.jpg" });
    expect(validUpdate.status).toBe(200);
    expect(validUpdate.body.data.price).toBe(100.5);
    expect(validUpdate.body.data.stock).toBe(3);
  });

  test("type-checks fields before trim and numeric coercion", async () => {
    const response = await request(app).post("/products").send({
      name: 123,
      description: { value: "Description" },
      price: { value: 100 },
      stock: "not-an-integer",
      category: 456,
      imageUrl: "https://example.com/product.jpg",
    });

    expect(response.status).toBe(400);
    expect(response.body.data).toBeNull();
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "name" }),
        expect.objectContaining({ field: "description" }),
        expect.objectContaining({ field: "price" }),
        expect.objectContaining({ field: "stock" }),
        expect.objectContaining({ field: "category" }),
      ])
    );
  });

  test("coerces page and limit query values before the controller", async () => {
    const response = await request(app).get("/products?page=2&limit=10");

    expect(response.status).toBe(200);
    expect(response.body.data.page).toBe(2);
    expect(response.body.data.limit).toBe(10);
  });

  test("type-checks checkout strings before trimming or membership checks", async () => {
    const response = await request(app).post("/checkout").send({
      shippingAddress: 123,
      paymentMethod: { value: "COD" },
    });

    expect(response.status).toBe(400);
    expect(response.body.data).toBeNull();
  });
});
