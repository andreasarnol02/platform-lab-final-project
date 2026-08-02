import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";
import client from "../api/client";
import { useAuth } from "./AuthContext";

jest.mock("../api/client", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("./AuthContext", () => ({
  useAuth: jest.fn(),
}));

function CartProbe() {
  const { items, error, refresh } = useCart();

  return (
    <div>
      <div>{items.map((item) => item.product.name).join(", ")}</div>
      {error && <div role="alert">{error}</div>}
      <button type="button" onClick={refresh}>Refresh</button>
    </div>
  );
}

describe("CartProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ token: "customer-token" });
  });

  test("preserves the last successful cart and exposes a refresh error", async () => {
    const product = {
      _id: "product-1",
      name: "Test camera",
      price: 1000000,
      stock: 2,
    };
    client.get
      .mockResolvedValueOnce({ data: { data: { items: [{ product, quantity: 1 }] } } })
      .mockRejectedValueOnce({ response: { data: { message: "Cart unavailable" } } });

    render(
      <CartProvider>
        <CartProbe />
      </CartProvider>
    );

    expect(await screen.findByText("Test camera")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Cart unavailable");
    expect(screen.getByText("Test camera")).toBeInTheDocument();
  });
});
