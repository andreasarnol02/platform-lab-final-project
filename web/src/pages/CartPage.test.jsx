import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import CartPage from "./CartPage";
import { useCart } from "../context/CartContext";

jest.mock("../context/CartContext", () => ({
  useCart: jest.fn(),
}));

describe("CartPage", () => {
  test("shows a retry error without hiding existing items", () => {
    const refresh = jest.fn();
    useCart.mockReturnValue({
      items: [
        {
          product: {
            _id: "product-1",
            name: "Test camera",
            price: 1000000,
            stock: 2,
            seller: { storeName: "Toko Kamera" },
          },
          quantity: 1,
        },
      ],
      loading: false,
      error: "Gagal memuat keranjang.",
      totalPrice: 1000000,
      updateQuantity: jest.fn(),
      removeItem: jest.fn(),
      refresh,
    });

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Gagal memuat keranjang.");
    expect(screen.getByText("Test camera")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Jumlah Test camera" })).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "Jumlah 1" })).toHaveAttribute(
      "aria-live",
      "polite"
    );
    expect(screen.getByRole("button", { name: "Kurangi jumlah Test camera" })).toHaveAttribute(
      "type",
      "button"
    );
    expect(screen.getByRole("button", { name: "Tambah jumlah Test camera" })).toHaveAttribute(
      "type",
      "button"
    );
    expect(
      screen.getByRole("button", { name: "Hapus Test camera dari keranjang" })
    ).toHaveAttribute("type", "button");
    expect(screen.getByRole("button", { name: "Coba lagi" })).toHaveAttribute(
      "type",
      "button"
    );
  });
});
