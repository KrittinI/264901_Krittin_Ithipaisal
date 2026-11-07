import { orders } from "../../../../../constants";

export async function GET(request, { params }) {
  const { orderId } = await params;

  const order = orders.get(orderId);

  if (!order) {
    return Response.json({ message: `Order Not Found.` }, { status: 404 });
  }

  return Response.json({ order });
}

export async function PUT(request, { params }) {
  const { orderId } = await params;

  const res = await request.json();
  return Response.json({ res });
}
