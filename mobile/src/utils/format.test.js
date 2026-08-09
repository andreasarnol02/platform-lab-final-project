import {
  formatDate,
  formatIDR,
  formatIDRInput,
  formatInvoiceId,
} from "./format";

describe("formatIDR", () => {
  it("formats a plain amount with thousand separators", () => {
    expect(formatIDR(250000)).toBe("Rp 250.000");
  });

  it("formats zero", () => {
    expect(formatIDR(0)).toBe("Rp 0");
  });

  it("formats a large amount", () => {
    expect(formatIDR(1234567890)).toBe("Rp 1.234.567.890");
  });
});

describe("formatIDRInput", () => {
  it("keeps only digits and adds thousand separators", () => {
    expect(formatIDRInput("Rp 1.500.000")).toBe("1.500.000");
  });

  it("strips non-digit characters", () => {
    expect(formatIDRInput("abc123")).toBe("123");
  });

  it("handles an empty string", () => {
    expect(formatIDRInput("")).toBe("");
  });
});

describe("formatDate", () => {
  it("formats a local date as id-ID short date + time", () => {
    expect(formatDate(new Date(2026, 7, 9, 14, 5))).toBe("9 Agu 2026, 14.05");
  });
});

describe("formatInvoiceId", () => {
  it("uses the last 8 chars of the order id, uppercased", () => {
    expect(formatInvoiceId({ _id: "abc12345" })).toBe("#ABC12345");
  });

  it("handles short ids", () => {
    expect(formatInvoiceId({ _id: "ab" })).toBe("#AB");
  });
});
