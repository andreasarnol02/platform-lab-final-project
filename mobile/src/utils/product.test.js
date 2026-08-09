import { getItemName, getProductImage } from "./product";

describe("getProductImage", () => {
  it("prefers imageUrl", () => {
    expect(getProductImage({ imageUrl: "x" })).toBe("x");
  });

  it("falls back to the first image", () => {
    expect(getProductImage({ images: ["y"] })).toBe("y");
  });

  it("returns an empty string for an empty product", () => {
    expect(getProductImage({})).toBe("");
  });

  it("returns an empty string for null", () => {
    expect(getProductImage(null)).toBe("");
  });
});

describe("getItemName", () => {
  it("prefers the item name", () => {
    expect(getItemName({ name: "Laptop", product: { name: "Produk X" } })).toBe(
      "Laptop"
    );
  });

  it("falls back to the product name", () => {
    expect(getItemName({ product: { name: "Produk X" } })).toBe("Produk X");
  });

  it("falls back to the default label", () => {
    expect(getItemName({})).toBe("Produk");
    expect(getItemName(null)).toBe("Produk");
  });
});
