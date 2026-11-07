export function getOrderSubtotal(order) {
  if (!Array.isArray(order?.products) || order.products.length === 0) {
    return null;
  }

  let subtotal = 0;
  for (const product of order.products) {
    const quantity = product.amount ?? 1;
    if (
      typeof product.price !== "number" ||
      !Number.isFinite(product.price) ||
      product.price < 0 ||
      typeof quantity !== "number" ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      return null;
    }

    subtotal += product.price * quantity;
  }

  return Number.isFinite(subtotal) ? subtotal : null;
}

export function calculateOrderDiscounts(
  order,
  { couponId, ontopId, ontopPoints, seasonalId },
  { coupons, ontops, seasonals }
) {
  const subtotal = getOrderSubtotal(order);
  if (subtotal === null) {
    return { status: 400, error: { order: "INVALID_ORDER_PRODUCTS" } };
  }

  let remaining = subtotal;
  const discount = { coupon: 0, onTop: 0, seasonal: 0 };

  if (couponId !== null) {
    const coupon = coupons.get(couponId);
    if (!coupon) {
      return { status: 404, error: { coupon: "COUPON_NOT_FOUND" } };
    }
    if (
      typeof coupon.amount !== "number" ||
      !Number.isFinite(coupon.amount) ||
      coupon.amount < 0
    ) {
      return { status: 400, error: { coupon: "INVALID_COUPON" } };
    }

    discount.coupon =
      coupon.type === "fixed"
        ? Math.min(coupon.amount, remaining)
        : (remaining * coupon.amount) / 100;
    remaining -= discount.coupon;
  }

  if (ontopId !== null) {
    const ontop = ontops.get(ontopId);
    if (!ontop) {
      return { status: 404, error: { ontop: "ONTOP_NOT_FOUND" } };
    }

    if (ontop.type === "points") {
      if (ontopPoints === null || ontopPoints.trim() === "") {
        return { status: 400, error: { ontopPoints: "REQUIRED_FOR_POINTS" } };
      }
      const points = Number(ontopPoints);
      if (!Number.isFinite(points) || points < 0) {
        return { status: 400, error: { ontopPoints: "INVALID_POINTS" } };
      }
      discount.onTop = Math.min(points, remaining * 0.2);
    } else {
      if (ontopPoints !== null) {
        return { status: 400, error: { ontopPoints: "ONLY_FOR_POINTS_CAMPAIGN" } };
      }
      if (
        typeof ontop.amount !== "number" ||
        !Number.isFinite(ontop.amount) ||
        ontop.amount < 0
      ) {
        return { status: 400, error: { ontop: "INVALID_ONTOP_CAMPAIGN" } };
      }

      const categorySubtotal = order.products
        .filter((product) => product.category === ontop.type)
        .reduce((sum, product) => sum + product.price * (product.amount ?? 1), 0);
      discount.onTop = Math.min(
        remaining,
        (categorySubtotal * ontop.amount) / 100
      );
    }
    remaining -= discount.onTop;
  } else if (ontopPoints !== null) {
    return { status: 400, error: { ontopPoints: "REQUIRES_ONTOP_ID" } };
  }

  if (seasonalId !== null) {
    const seasonal = seasonals.get(seasonalId);
    if (!seasonal) {
      return { status: 404, error: { seasonal: "SEASONAL_NOT_FOUND" } };
    }
    const every = Number(seasonal.every);
    const amount = Number(seasonal.discount);
    if (
      !Number.isFinite(every) ||
      every <= 0 ||
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      return { status: 400, error: { seasonal: "INVALID_SEASONAL_CAMPAIGN" } };
    }

    discount.seasonal = Math.min(
      remaining,
      Math.floor(remaining / every) * amount
    );
    remaining -= discount.seasonal;
  }

  return {
    subtotal,
    discount,
    totalDiscount: subtotal - remaining,
    total: remaining,
  };
}
