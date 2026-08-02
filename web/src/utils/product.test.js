import { getProductImage } from "./product";

describe("product image normalization", () => {
  test("prefers the canonical image URL", () => {
    expect(
      getProductImage({
        imageUrl: "https://cdn.example.com/new.jpg",
        images: ["https://cdn.example.com/legacy.jpg"],
      })
    ).toBe("https://cdn.example.com/new.jpg");
  });

  test("reads the first legacy image while data is migrated", () => {
    expect(getProductImage({ images: ["https://cdn.example.com/legacy.jpg"] })).toBe(
      "https://cdn.example.com/legacy.jpg"
    );
  });
});
