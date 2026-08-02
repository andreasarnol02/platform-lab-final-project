import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import ProductDetailPage from "./ProductDetailPage";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

jest.mock("../api/client", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../context/CartContext", () => ({
  useCart: jest.fn(),
}));

describe("ProductDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: { name: "Customer" } });
    useCart.mockReturnValue({ addItem: jest.fn() });
    client.get.mockResolvedValue({
      data: {
        data: {
          _id: "product-1",
          name: "Test camera",
          description: "A camera",
          category: "Elektronik",
          price: 1000000,
          stock: 4,
          imageUrl: "https://cdn.example.com/camera.jpg",
          seller: { storeName: "Toko Kamera" },
        },
      },
    });
  });

  test("provides accessible quantity controls", async () => {
    render(
      <MemoryRouter initialEntries={["/products/product-1"]}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const group = await screen.findByRole("group", { name: "Jumlah Test camera" });
    const quantity = screen.getByRole("spinbutton", { name: "Jumlah 1" });

    expect(group).toContainElement(quantity);
    expect(quantity).toHaveAttribute("aria-live", "polite");
    expect(quantity).toHaveAttribute("aria-valuemin", "1");
    expect(quantity).toHaveAttribute("aria-valuemax", "4");
    expect(screen.getByRole("button", { name: "Kurangi jumlah Test camera" })).toHaveAttribute(
      "type",
      "button"
    );
    expect(screen.getByRole("button", { name: "Tambah jumlah Test camera" })).toHaveAttribute(
      "type",
      "button"
    );
  });
});
