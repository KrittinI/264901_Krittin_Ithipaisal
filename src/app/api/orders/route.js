import {
  allocateOrderId,
  coupons as allCoupons,
  ontops,
  orders as savedOrders,
  products,
  seasonals,
} from "../../../../constants";
import { validateOrders } from "../../../../validators";
import { readJsonObject } from "../_utils/request";
import { calculateOrderDiscounts } from "./_utils/discounts";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const allowedParams = new Set([
    "orderId",
    "couponId",
    "ontopId",
    "ontopPoints",
    "seasonalId",
  ]);
  const unknownParam = Array.from(searchParams.keys()).find(
    (key) => !allowedParams.has(key)
  );
  if (unknownParam) {
    return Response.json(
      { message: "Bad Request.", error: { query: "INVALID_PARAMETER" } },
      { status: 400 }
    );
  }

  const duplicateParam = Array.from(allowedParams).find(
    (key) => searchParams.getAll(key).length > 1
  );
  if (duplicateParam) {
    return Response.json(
      { message: "Bad Request.", error: { query: "DUPLICATE_PARAMETER" } },
      { status: 400 }
    );
  }

  const orderId = searchParams.get("orderId");
  const couponId = searchParams.get("couponId");
  const ontopId = searchParams.get("ontopId");
  const ontopPoints = searchParams.get("ontopPoints");
  const seasonalId = searchParams.get("seasonalId");

  if (!orderId) {
    return Response.json(
      { message: "Bad Request.", error: { orderId: "REQUIRED" } },
      { status: 400 }
    );
  }

  const order = savedOrders.get(orderId);
  if (!order) {
    return Response.json({ message: "Order Not Found." }, { status: 404 });
  }

  const result = calculateOrderDiscounts(
    order,
    { couponId, ontopId, ontopPoints, seasonalId },
    { coupons: allCoupons, ontops, seasonals }
  );

  if (result.status) {
    const message = result.status === 404 ? "Not Found." : "Bad Request.";
    return Response.json({ message, error: result.error }, { status: result.status });
  }

  return Response.json({ order, ...result });
}

export async function POST(request) {
  const body = await readJsonObject(request);
  if (!body) {
    return Response.json(
      { message: "Bad Request.", error: { body: "INVALID_JSON_OBJECT" } },
      { status: 400 }
    );
  }

  if (Object.keys(body).some((key) => key !== "orders")) {
    return Response.json(
      { message: "Bad Request.", error: { body: "UNEXPECTED_FIELD" } },
      { status: 400 }
    );
  }

  const { orders } = body;

  const error = validateOrders({ orders, products });

  if (error) {
    return Response.json({ message: "Bad Request.", error }, { status: 400 });
  }

  const embeddedProducts = orders.map((order) => {
    const product = products.get(String(order.id));
    return {
      ...product,
      ...(Object.hasOwn(order, "amount") ? { amount: order.amount } : {}),
    };
  });
  const order = { id: allocateOrderId(), products: embeddedProducts };
  savedOrders.set(order.id, order);

  return Response.json({ order }, { status: 201 });
}
