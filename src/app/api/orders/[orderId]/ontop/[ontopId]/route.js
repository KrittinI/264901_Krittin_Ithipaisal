import { ontops, orders } from "../../../../../../../constants";

export async function PUT(request, { params }) {
  const { orderId, ontopId } = await params;
  const order = orders.get(orderId);

  if (!order) {
    return Response.json({ message: "Order Not Found." }, { status: 404 });
  }

  const ontop = ontops.get(ontopId);
  if (!ontop) {
    return Response.json({ message: "On-top Campaign Not Found." }, { status: 404 });
  }

  const updatedOrder = { ...order, ontop };
  orders.set(orderId, updatedOrder);

  return Response.json({ order: updatedOrder });
}
