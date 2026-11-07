import { coupons, orders } from "../../../../../../../constants";

export async function PATCH(request, { params }) {
  const { orderId, couponId } = await params;
  const order = orders.get(orderId);

  if (!order) {
    return Response.json({ message: "Order Not Found." }, { status: 404 });
  }

  const coupon = coupons.get(couponId);
  if (!coupon) {
    return Response.json({ message: "Coupon Not Found." }, { status: 404 });
  }

  const updatedOrder = { ...order, coupon };
  orders.set(orderId, updatedOrder);

  return Response.json({ order: updatedOrder });
}
