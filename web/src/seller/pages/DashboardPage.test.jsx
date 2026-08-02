import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import DashboardPage from "./DashboardPage";
import client from "../api/client";

jest.mock("../api/client", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("seller DashboardPage", () => {
  test("counts only active products for listed and out-of-stock metrics", async () => {
    client.get.mockImplementation((path) => {
      if (path === "/seller/products") {
        return Promise.resolve({
          data: {
            data: [
              { _id: "active-out", name: "Active out", stock: 0, isActive: true },
              { _id: "active-in", name: "Active in", stock: 3, isActive: true },
              { _id: "inactive-out", name: "Inactive out", stock: 0, isActive: false },
            ],
          },
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Produk Terdaftar")).toBeInTheDocument());

    const listedCard = screen.getByText("Produk Terdaftar").parentElement;
    const outOfStockCard = screen.getByText("Stok Habis").parentElement;
    expect(within(listedCard).getByText("2")).toBeInTheDocument();
    expect(within(outOfStockCard).getByText("1")).toBeInTheDocument();
  });
});
