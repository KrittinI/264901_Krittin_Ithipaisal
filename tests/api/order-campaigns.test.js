import assert from "node:assert/strict";
import test from "node:test";

import { coupons, ontops, orders, seasonals } from "../../constants/index.js";
import * as applyCouponRoute from "../../src/app/api/orders/[orderId]/coupon/[couponId]/route.js";
import * as applyOntopRoute from "../../src/app/api/orders/[orderId]/ontop/[ontopId]/route.js";
import * as applySeasonalRoute from "../../src/app/api/orders/[orderId]/seasonal/[seasonId]/route.js";
import { makeRequest, responseBody } from "./helpers.js";

test("order campaign routes resolve campaign IDs from Maps and update the order", async () => {
  const order = { id: "test-order", products: [] };
  orders.set(order.id, order);

  try {
    const couponResponse = await applyCouponRoute.PATCH(
      makeRequest("http://localhost", { method: "PATCH" }),
      { params: Promise.resolve({ orderId: order.id, couponId: "0" }) }
    );
    assert.equal(couponResponse.status, 200);
    assert.deepEqual((await responseBody(couponResponse)).order.coupon, coupons.get("0"));

    const ontopResponse = await applyOntopRoute.PUT(
      makeRequest("http://localhost", { method: "PUT" }),
      { params: Promise.resolve({ orderId: order.id, ontopId: "0" }) }
    );
    assert.equal(ontopResponse.status, 200);
    assert.deepEqual((await responseBody(ontopResponse)).order.ontop, ontops.get("0"));

    const seasonalResponse = await applySeasonalRoute.PUT(
      makeRequest("http://localhost", { method: "PUT" }),
      { params: Promise.resolve({ orderId: order.id, seasonId: "0" }) }
    );
    assert.equal(seasonalResponse.status, 200);
    assert.deepEqual((await responseBody(seasonalResponse)).order.seasonal, seasonals.get("0"));

    assert.equal(orders.get(order.id).coupon.id, "0");
    assert.equal(orders.get(order.id).ontop.id, "0");
    assert.equal(orders.get(order.id).seasonal.id, "0");
  } finally {
    orders.delete(order.id);
  }
});
