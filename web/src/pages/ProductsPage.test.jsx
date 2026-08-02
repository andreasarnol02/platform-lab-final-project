import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import client from "../api/client";
import ProductsPage from "./ProductsPage";

jest.mock("../api/client", () => ({
  get: jest.fn(),
}));

describe("ProductsPage", () => {
  test("loads catalog results using URL search filters", async () => {
    client.get.mockResolvedValue({
      data: {
        data: [
          {
            _id: "product-1",
            name: "Test camera",
            category: "Elektronik",
            price: 1000000,
            stock: 2,
            imageUrl: "https://cdn.example.com/camera.jpg",
            seller: { storeName: "Toko Kamera" },
          },
        ],
        pagination: { page: 1, limit: 24, total: 1, pages: 1 },
      },
    });

    render(
      <MemoryRouter initialEntries={["/products?search=camera"]}>
        <ProductsPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Test camera")).toBeInTheDocument());
    expect(client.get).toHaveBeenCalledWith("/products", {
      params: { search: "camera", category: undefined },
    });
    expect(screen.getByText(/Hasil pencarian untuk/)).toBeInTheDocument();
  });
});
