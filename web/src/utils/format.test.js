import { formatIDR, formatIDRInput } from "./format";

describe("IDR formatting", () => {
  test("formats display values with Indonesian grouping", () => {
    expect(formatIDR(7777777777).replace(/\s/g, "")).toContain("Rp7.777.777.777");
  });

  test("keeps seller price input numeric while displaying dot grouping", () => {
    expect(formatIDRInput("7777777777")).toBe("7.777.777.777");
    expect(formatIDRInput("Rp 7.777.777.777")).toBe("7.777.777.777");
  });
});
