import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Navbar from "./Navbar";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null, logout: jest.fn() }),
}));

jest.mock("../context/CartContext", () => ({
  useCart: () => ({ totalCount: 0 }),
}));

describe("Navbar", () => {
  test("focuses the product search on Cmd/Ctrl+K", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const input = screen.getByRole("searchbox", { name: "Cari produk" });
    input.value = "camera";
    input.focus();
    input.setSelectionRange(0, input.value.length);
    input.blur();

    fireEvent.keyDown(window, { key: "k", metaKey: true });

    expect(input).toHaveFocus();
  });

  test("supports Ctrl+K for non-Mac keyboards", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const input = screen.getByRole("searchbox", { name: "Cari produk" });
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });

    expect(input).toHaveFocus();
  });
});
