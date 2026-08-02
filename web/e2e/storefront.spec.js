import { expect, test } from "@playwright/test";

const products = {
  success: true,
  data: [
    {
      _id: "product-1",
      name: "Test camera",
      category: "Elektronik",
      price: 7777777777,
      stock: 4,
      imageUrl: "https://cdn.example.com/camera.jpg",
      seller: { storeName: "Toko Kamera" },
    },
  ],
  pagination: { page: 1, limit: 24, total: 1, pages: 1 },
};

test("customer storefront loads a product from the unified web app", async ({ page }) => {
  await page.route("**/api/products**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(products) })
  );

  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Test camera").first()).toBeVisible();
  await expect(page.getByText(/Rp\s*7\.777\.777\.777/).first()).toBeVisible();
});

test("seller login stays under the seller route namespace", async ({ page }) => {
  await page.goto("/seller/login");

  await expect(page).toHaveURL(/\/seller\/login$/);
  await expect(page.getByRole("heading", { name: "Masuk ke Toko" })).toBeVisible();
  await expect(page.getByText("Kelola produk dan pesanan tokomu.")).toBeVisible();
});

test("customer protected routes redirect guests to customer login", async ({ page }) => {
  await page.goto("/cart");

  await expect(page).toHaveURL(/\/login\?redirect=/);
  await expect(page.getByRole("heading", { name: "Masuk sebagai Pembeli" })).toBeVisible();
});
