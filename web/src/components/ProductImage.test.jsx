import { fireEvent, render, screen } from "@testing-library/react";
import ProductImage from "./ProductImage";

describe("ProductImage", () => {
  test("renders an accessible placeholder when no image URL exists", () => {
    render(<ProductImage alt="Test product" />);

    expect(screen.getByRole("img", { name: "Test product" })).toHaveTextContent("m");
  });

  test("falls back after an image load failure", () => {
    render(<ProductImage src="https://cdn.example.com/test.jpg" alt="Test product" />);

    const image = screen.getByRole("img", { name: "Test product" });
    fireEvent.error(image);

    expect(screen.getByRole("img", { name: "Test product" })).not.toBe(image);
  });
});
