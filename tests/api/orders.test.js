import assert from "node:assert/strict";
import test from "node:test";

import { orders, products } from "../../constants/index.js";
import * as ordersRoute from "../../src/app/api/orders/route.js";
import * as orderItemRoute from "../../src/app/api/orders/[orderId]/route.js";
import { makeMalformedJsonRequest, makeRequest, responseBody } from "./helpers.js";

test("POST /api/orders stores catalog products embedded in the order", async () => {
  const response = await ordersRoute.POST(
    makeRequest("http://localhost/api/orders", {
      method: "POST",
      body: { orders: [{ id: "1", amount: 2 }, { id: 3, amount: 1 }] },
    })
  );
  const body = await responseBody(response);

  assert.equal(response.status, 201);
  assert.equal(typeof body.order.id, "string");
  assert.deepEqual(body.order.products, [
    { ...products.get("1"), amount: 2 },
    { ...products.get("3"), amount: 1 },
  ]);
  assert.deepEqual(orders.get(body.order.id), body.order);

  const itemResponse = await orderItemRoute.GET(makeRequest("http://localhost"), {
    params: Promise.resolve({ orderId: body.order.id }),
  });
  assert.deepEqual(await responseBody(itemResponse), { order: body.order });
});

test("POST /api/orders rejects invalid product references and request shapes", async () => {
  const invalidProductResponse = await ordersRoute.POST(
    makeRequest("http://localhost/api/orders", {
      method: "POST",
      body: { orders: [{ id: "1" }, { id: "missing" }] },
    })
  );
  assert.equal(invalidProductResponse.status, 400);
  assert.deepEqual((await responseBody(invalidProductResponse)).error, {
    orders: [null, "PRODUCT_NOT_FOUND"],
  });

  for (const body of [
    {},
    { orders: [] },
    { orders: [{ id: "1" }], coupon: "coupon-id" },
    { orders: [null] },
    { orders: [{ id: ["1"] }] },
  ]) {
    const response = await ordersRoute.POST(
      makeRequest("http://localhost/api/orders", { method: "POST", body })
    );
    assert.equal(response.status, 400);
  }

  const malformedResponse = await ordersRoute.POST(
    makeMalformedJsonRequest("http://localhost/api/orders")
  );
  assert.equal(malformedResponse.status, 400);
});

test("GET /api/orders calculates campaign discounts from query parameters", async () => {
  const order = {
    id: "discount-order",
    products: [{ ...products.get("1"), amount: 2 }],
  };
  orders.set(order.id, order);

  try {
    const response = await ordersRoute.GET(
      makeRequest(
        "http://localhost/api/orders?orderId=discount-order&couponId=0&ontopId=3&ontopPoints=200&seasonalId=0"
      )
    );
    const body = await responseBody(response);

    assert.equal(response.status, 200);
    assert.deepEqual(body, {
      order,
      subtotal: 700,
      discount: { coupon: 20, onTop: 136, seasonal: 27 },
      totalDiscount: 183,
      total: 517,
    });

    const pointsWithoutTypeResponse = await ordersRoute.GET(
      makeRequest(
        "http://localhost/api/orders?orderId=discount-order&ontopId=0&ontopPoints=20"
      )
    );
    assert.equal(pointsWithoutTypeResponse.status, 400);

    const missingPointsResponse = await ordersRoute.GET(
      makeRequest("http://localhost/api/orders?orderId=discount-order&ontopId=3")
    );
    assert.equal(missingPointsResponse.status, 400);
  } finally {
    orders.delete(order.id);
  }
});

test("GET /api/orders requires an order ID and returns 404 for unknown orders", async () => {
  const missingIdResponse = await ordersRoute.GET(makeRequest("http://localhost/api/orders"));
  assert.equal(missingIdResponse.status, 400);

  const unknownOrderResponse = await ordersRoute.GET(
    makeRequest("http://localhost/api/orders?orderId=missing")
  );
  assert.equal(unknownOrderResponse.status, 404);

  const invalidQueryResponse = await ordersRoute.GET(
    makeRequest("http://localhost/api/orders?orderId=missing&couponId2=1")
  );
  assert.equal(invalidQueryResponse.status, 400);

  const duplicateQueryResponse = await ordersRoute.GET(
    makeRequest("http://localhost/api/orders?orderId=missing&couponId=1&couponId=2")
  );
  assert.equal(duplicateQueryResponse.status, 400);
});
