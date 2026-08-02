import { getSafeRedirect } from "./LoginPage";

describe("getSafeRedirect", () => {
  test("allows internal paths", () => {
    expect(getSafeRedirect("/products/123")).toBe("/products/123");
  });

  test("rejects external and malformed redirects", () => {
    expect(getSafeRedirect("//evil.example")).toBe("/");
    expect(getSafeRedirect("%2F%2Fevil.example")).toBe("/");
    expect(getSafeRedirect("%E0%A4%A")).toBe("/");
  });
});
