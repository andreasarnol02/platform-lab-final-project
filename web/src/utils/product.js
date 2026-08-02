export const getProductImage = (product) => product?.imageUrl || product?.images?.[0] || "";
