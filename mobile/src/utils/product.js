export const getProductImage = (product) =>
  product?.imageUrl || product?.images?.[0] || "";

// Best-effort display name for an order line item.
export const getItemName = (item) => item?.name || item?.product?.name || "Produk";
