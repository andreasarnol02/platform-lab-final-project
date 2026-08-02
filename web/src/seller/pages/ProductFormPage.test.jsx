import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import ProductFormPage from "./ProductFormPage";
import client from "../api/client";

jest.mock("../api/client", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

describe("ProductFormPage", () => {
  beforeEach(() => jest.clearAllMocks());

  test("requires an image URL for a new product", () => {
    render(
      <MemoryRouter>
        <ProductFormPage />
      </MemoryRouter>
    );

    const imageUrl = screen.getByRole("textbox", { name: /URL Gambar/ });
    expect(imageUrl).toHaveAttribute("type", "url");
    expect(imageUrl).toBeRequired();
    expect(screen.getByText(/Wajib diisi dengan URL publik/)).toBeInTheDocument();
  });

  test("keeps the image URL required when editing", async () => {
    client.get.mockResolvedValue({
      data: {
        data: {
          name: "Test camera",
          description: "A camera",
          price: 1000000,
          stock: 2,
          category: "Elektronik",
          imageUrl: "https://cdn.example.com/camera.jpg",
        },
      },
    });

    render(
      <MemoryRouter initialEntries={["/seller/products/product-1/edit"]}>
        <Routes>
          <Route path="/seller/products/:id/edit" element={<ProductFormPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByDisplayValue("https://cdn.example.com/camera.jpg")).toBeRequired();
  });
});
