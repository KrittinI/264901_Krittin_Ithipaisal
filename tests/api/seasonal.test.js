import assert from "node:assert/strict";
import test from "node:test";

import { seasonals } from "../../constants/index.js";
import * as seasonalRoute from "../../src/app/api/seasonal/route.js";
import * as seasonalItemRoute from "../../src/app/api/seasonal/[seasonalId]/route.js";
import { makeRequest, responseBody } from "./helpers.js";

test("seasonal routes validate input and return the created campaign ID", async () => {
  const response = await seasonalRoute.POST(
    makeRequest("http://localhost/api/seasonal", {
      method: "POST",
      body: { every: 100, discount: 10 },
    })
  );
  const body = await responseBody(response);
  const storedSeasonal = seasonals.find((seasonal) => seasonal.id === body.id);

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
  assert.deepEqual(seasonals.find((seasonal) => seasonal.id === body.id), {
    id: body.id,
    every: 200,
    discount: 20,
  });

  const deleteResponse = await seasonalItemRoute.DELETE({
    params: Promise.resolve({ seasonalId: body.id }),
  });
  assert.equal(deleteResponse.status, 200);
  assert.equal(seasonals.some((seasonal) => seasonal.id === body.id), false);
});
