jest.mock("../src/models/product", () => ({
  findById: jest.fn(),
}));

const Product = require("../src/models/product");
const {
  getMyProductById,
  updateProduct,
  deleteProduct,
} = require("../src/controllers/productController");

const makeResponse = () => {
  const response = {
    status: jest.fn(),
    json: jest.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
};

const makeProductQuery = (product) => {
  const query = {
    populate: jest.fn(),
  };
  query.populate.mockResolvedValue(product);
  return query;
};

const makeProduct = (seller) => ({
  _id: "product-a",
  seller,
  name: "Product A",
  description: "Description",
  price: 100,
  stock: 2,
  category: "Category",
  imageUrl: "https://example.com/product.jpg",
  isActive: true,
  toObject() {
    return { ...this };
  },
  save: jest.fn().mockResolvedValue(undefined),
});

describe("seller product ownership", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("returns 403 for a foreign seller's product detail and 404 when it is missing", async () => {
    Product.findById.mockReturnValue(makeProductQuery(makeProduct("seller-a")));
    const forbiddenResponse = makeResponse();

    await getMyProductById(
      { user: { id: "seller-b" }, params: { id: "product-a" } },
      forbiddenResponse
    );

    expect(Product.findById).toHaveBeenCalledWith("product-a");
    expect(forbiddenResponse.status).toHaveBeenCalledWith(403);

    Product.findById.mockReturnValue(makeProductQuery(null));
    const missingResponse = makeResponse();
    await getMyProductById(
      { user: { id: "seller-b" }, params: { id: "missing" } },
      missingResponse
    );

    expect(missingResponse.status).toHaveBeenCalledWith(404);
  });

  test("returns 403 for a foreign seller on update and 404 when the product is missing", async () => {
    const foreignProduct = makeProduct("seller-a");
    Product.findById.mockResolvedValue(foreignProduct);
    const forbiddenResponse = makeResponse();

    await updateProduct(
      {
        user: { id: "seller-b" },
        params: { id: "product-a" },
        body: { name: "Updated" },
      },
      forbiddenResponse
    );

    expect(forbiddenResponse.status).toHaveBeenCalledWith(403);
    expect(foreignProduct.save).not.toHaveBeenCalled();

    Product.findById.mockResolvedValue(null);
    const missingResponse = makeResponse();
    await updateProduct(
      {
        user: { id: "seller-b" },
        params: { id: "missing" },
        body: { name: "Updated" },
      },
      missingResponse
    );

    expect(missingResponse.status).toHaveBeenCalledWith(404);
  });

  test("returns 403 for a foreign seller on delete and 404 when the product is missing", async () => {
    const foreignProduct = makeProduct("seller-a");
    Product.findById.mockResolvedValue(foreignProduct);
    const forbiddenResponse = makeResponse();

    await deleteProduct(
      { user: { id: "seller-b" }, params: { id: "product-a" } },
      forbiddenResponse
    );

    expect(forbiddenResponse.status).toHaveBeenCalledWith(403);
    expect(foreignProduct.save).not.toHaveBeenCalled();

    Product.findById.mockResolvedValue(null);
    const missingResponse = makeResponse();
    await deleteProduct(
      { user: { id: "seller-b" }, params: { id: "missing" } },
      missingResponse
    );

    expect(missingResponse.status).toHaveBeenCalledWith(404);
  });

  test("deactivates a legacy product without an imageUrl", async () => {
    const legacyProduct = makeProduct("seller-a");
    delete legacyProduct.imageUrl;
    Product.findById.mockResolvedValue(legacyProduct);

    const res = makeResponse();
    await deleteProduct(
      { user: { id: "seller-a" }, params: { id: "product-a" } },
      res
    );

    expect(legacyProduct.isActive).toBe(false);
    expect(legacyProduct.save).toHaveBeenCalledWith({ validateBeforeSave: false });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
