import assert from "node:assert/strict";
import test from "node:test";

import { coupons } from "../../constants/index.js";
import * as couponRoute from "../../src/app/api/coupons/route.js";
import * as couponItemRoute from "../../src/app/api/coupons/[couponId]/route.js";
import { makeMalformedJsonRequest, makeRequest, responseBody } from "./helpers.js";

test("coupon routes validate input and return the created coupon ID", async () => {
  const malformedResponse = await couponRoute.POST(
    makeMalformedJsonRequest("http://localhost/api/coupons")
  );
  assert.equal(malformedResponse.status, 400);

  const nullBodyResponse = await couponRoute.POST(
    makeRequest("http://localhost/api/coupons", { method: "POST", body: null })
  );
  assert.equal(nullBodyResponse.status, 400);

  const response = await couponRoute.POST(
    makeRequest("http://localhost/api/coupons", {
      method: "POST",
      body: { type: "fixed", amount: 10 },
    })
  );
  const body = await responseBody(response);
  const storedCoupon = coupons.get(body.id);

  assert.equal(response.status, 201);
  assert.ok(storedCoupon);
  assert.deepEqual(storedCoupon, { id: body.id, type: "fixed", amount: 10 });

  for (const invalidBody of [
    { type: "fixed", amount: "10" },
    { type: "percentage", amount: 100 },
    { type: "constructor", amount: 10 },
  ]) {
    const invalidResponse = await couponRoute.POST(
      makeRequest("http://localhost/api/coupons", {
        method: "POST",
        body: invalidBody,
      })
    );
    assert.equal(invalidResponse.status, 400);
  }

  const filteredResponse = await couponRoute.GET(
    makeRequest("http://localhost/api/coupons?type=fixed")
  );
  const filteredBody = await responseBody(filteredResponse);
  assert.ok(filteredBody.coupons.every((coupon) => coupon.type === "fixed"));

  const inheritedTypeResponse = await couponRoute.GET(
    makeRequest("http://localhost/api/coupons?type=constructor")
  );
  assert.equal(inheritedTypeResponse.status, 400);

  const itemResponse = await couponItemRoute.GET(makeRequest("http://localhost"), {
    params: Promise.resolve({ couponId: body.id }),
  });
  assert.deepEqual(await responseBody(itemResponse), { coupon: storedCoupon });

  const updateResponse = await couponItemRoute.PUT(
    makeRequest("http://localhost", {
      method: "PUT",
      body: { type: "percentage", amount: 20 },
    }),
    { params: Promise.resolve({ couponId: body.id }) }
  );
  assert.equal(updateResponse.status, 200);
  assert.deepEqual(coupons.get(body.id), {
    id: body.id,
    type: "percentage",
    amount: 20,
  });

  const malformedUpdateResponse = await couponItemRoute.PUT(
    makeMalformedJsonRequest("http://localhost", "PUT"),
    { params: Promise.resolve({ couponId: body.id }) }
  );
  assert.equal(malformedUpdateResponse.status, 400);

  const deleteResponse = await couponItemRoute.DELETE({
    params: Promise.resolve({ couponId: body.id }),
  });
  assert.equal(deleteResponse.status, 200);
  assert.equal(coupons.has(body.id), false);
});
