import {
  allocateOrderId,
  orders as savedOrders,
  products,
} from "../../../../constants";
import { validateOrders } from "../../../../validators";
import { readJsonObject } from "../_utils/request";

export async function GET(request) {}

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
