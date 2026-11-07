import { orders, seasonals } from "../../../../../../../constants";

export async function PUT(request, { params }) {
  const { orderId, seasonId } = await params;
  const order = orders.get(orderId);

  if (!order) {
    return Response.json({ message: "Order Not Found." }, { status: 404 });
  }

  const seasonal = seasonals.get(seasonId);
  if (!seasonal) {
    return Response.json({ message: "Seasonal Campaign Not Found." }, { status: 404 });
  }

  const updatedOrder = { ...order, seasonal };
  orders.set(orderId, updatedOrder);

  return Response.json({ order: updatedOrder });
}
