import { orders } from "../../../../../constants";
import { readJsonObject } from "../../_utils/request";

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
