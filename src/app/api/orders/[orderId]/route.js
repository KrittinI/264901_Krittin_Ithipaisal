import { orders } from "../../../../../constants";
import { readJsonObject } from "../../_utils/request";

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

  const body = await readJsonObject(request);

  if (!body) {
    return Response.json(
      { message: "Bad Request.", error: { body: "INVALID_JSON_OBJECT" } },
      { status: 400 }
    );
  }

  const { coupon, ontop, seasonal } = body;

  return Response.json({ res });
}
