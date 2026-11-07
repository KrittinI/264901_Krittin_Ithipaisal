import { orders } from "../../../../../constants";

export async function GET(request, { params }) {
  const { orderId } = await params;

  const orderIndex = orders.findIndex((order) => order.id === orderId);

  if (orderIndex === -1) {
    return Response.json({ message: `Order Not Found.` }, { status: 404 });
  }

  return Response.json({ order: orders[orderIndex] });
}

export async function PUT(request, { params }) {
  const { orderId } = await params;

  const res = await request.json();
  return Response.json({ res });
}
