import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "./ProductCard";

describe("ProductCard", () => {
  test("renders the normalized product image, seller, and IDR price", () => {
    render(
      <MemoryRouter>
        <ProductCard
          product={{
            _id: "product-1",
            name: "Test camera",
            category: "Elektronik",
            price: 7777777777,
            stock: 4,
            images: ["https://cdn.example.com/camera.jpg"],
            seller: { storeName: "Toko Kamera" },
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("img", { name: "Test camera" })).toHaveAttribute(
      "src",
      "https://cdn.example.com/camera.jpg"
    );
    expect(screen.getByText("Test camera")).toBeInTheDocument();
    expect(screen.getByText(/Rp\s*7\.777\.777\.777/)).toBeInTheDocument();
    expect(screen.getByText("Toko Kamera")).toBeInTheDocument();
  });
});
