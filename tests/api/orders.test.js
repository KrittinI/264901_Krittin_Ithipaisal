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
