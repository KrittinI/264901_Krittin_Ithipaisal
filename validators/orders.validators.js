export function validateOrders({ orders, products }) {
  if (!Array.isArray(orders) || orders.length === 0) {
    return { orders: "INVALID_ORDERS" };
  }

  const orderErrors = orders.map((order) => {
    if (order === null || typeof order !== "object" || Array.isArray(order)) {
      return "INVALID_ORDER_ITEM";
    }

    if (typeof order.id !== "string" && typeof order.id !== "number") {
      return "INVALID_PRODUCT_ID";
    }

    const productExists = products.has(String(order.id));

    return productExists ? null : "PRODUCT_NOT_FOUND";
  });

  return orderErrors.some(Boolean) ? { orders: orderErrors } : null;
}
