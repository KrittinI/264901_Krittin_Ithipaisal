import assert from "node:assert/strict";
import test from "node:test";

import { seasonals } from "../../constants/index.js";
import * as seasonalRoute from "../../src/app/api/seasonal/route.js";
import * as seasonalItemRoute from "../../src/app/api/seasonal/[seasonalId]/route.js";
import { makeMalformedJsonRequest, makeRequest, responseBody } from "./helpers.js";

test("seasonal routes validate input and return the created campaign ID", async () => {
  const malformedResponse = await seasonalRoute.POST(
    makeMalformedJsonRequest("http://localhost/api/seasonal")
  );
  assert.equal(malformedResponse.status, 400);

  const nullBodyResponse = await seasonalRoute.POST(
    makeRequest("http://localhost/api/seasonal", { method: "POST", body: null })
  );
  assert.equal(nullBodyResponse.status, 400);

  const response = await seasonalRoute.POST(
    makeRequest("http://localhost/api/seasonal", {
      method: "POST",
      body: { every: 100, discount: 10 },
    })
  );
  const body = await responseBody(response);
  const storedSeasonal = seasonals.get(body.id);

  assert.equal(response.status, 201);
  assert.ok(storedSeasonal);
  assert.deepEqual(storedSeasonal, { id: body.id, every: 100, discount: 10 });

  for (const invalidBody of [
    { every: "100", discount: 10 },
    { every: 100, discount: 100 },
    { every: 100, discount: null },
  ]) {
    const invalidResponse = await seasonalRoute.POST(
      makeRequest("http://localhost/api/seasonal", {
        method: "POST",
        body: invalidBody,
      })
    );
    assert.equal(invalidResponse.status, 400);
  }

  const listResponse = await seasonalRoute.GET(makeRequest("http://localhost/api/seasonal"));
  const listBody = await responseBody(listResponse);
  assert.ok(listBody.seasonals.some((seasonal) => seasonal.id === body.id));

  const itemResponse = await seasonalItemRoute.GET(makeRequest("http://localhost"), {
    params: Promise.resolve({ seasonalId: body.id }),
  });
  assert.deepEqual(await responseBody(itemResponse), { seasonal: storedSeasonal });

  const updateResponse = await seasonalItemRoute.PUT(
    makeRequest("http://localhost", {
      method: "PUT",
      body: { every: 200, discount: 20 },
    }),
    { params: Promise.resolve({ seasonalId: body.id }) }
  );
  assert.equal(updateResponse.status, 200);
  assert.deepEqual(seasonals.get(body.id), {
    id: body.id,
    every: 200,
    discount: 20,
  });

  const malformedUpdateResponse = await seasonalItemRoute.PUT(
    makeMalformedJsonRequest("http://localhost", "PUT"),
    { params: Promise.resolve({ seasonalId: body.id }) }
  );
  assert.equal(malformedUpdateResponse.status, 400);

  const deleteResponse = await seasonalItemRoute.DELETE({
    params: Promise.resolve({ seasonalId: body.id }),
  });
  assert.equal(deleteResponse.status, 200);
  assert.equal(seasonals.has(body.id), false);
});
