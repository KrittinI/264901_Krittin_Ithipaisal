import assert from "node:assert/strict";
import test from "node:test";

import { ontops } from "../../constants/index.js";
import * as ontopRoute from "../../src/app/api/ontop/route.js";
import * as ontopItemRoute from "../../src/app/api/ontop/[ontopId]/route.js";
import { makeMalformedJsonRequest, makeRequest, responseBody } from "./helpers.js";

test("ontop routes validate input and return the created campaign ID", async () => {
  const malformedResponse = await ontopRoute.POST(
    makeMalformedJsonRequest("http://localhost/api/ontop")
  );
  assert.equal(malformedResponse.status, 400);

  const nullBodyResponse = await ontopRoute.POST(
    makeRequest("http://localhost/api/ontop", { method: "POST", body: null })
  );
  assert.equal(nullBodyResponse.status, 400);

  const response = await ontopRoute.POST(
    makeRequest("http://localhost/api/ontop", {
      method: "POST",
      body: { type: "clothing", amount: 10 },
    })
  );
  const body = await responseBody(response);
  const storedOntop = ontops.get(body.id);

  assert.equal(response.status, 201);
  assert.ok(storedOntop);
  assert.deepEqual(storedOntop, { id: body.id, type: "clothing", amount: 10 });

  for (const invalidBody of [
    { type: "clothing", amount: "10" },
    { type: "clothing", amount: 100 },
    { type: "constructor", amount: 10 },
  ]) {
    const invalidResponse = await ontopRoute.POST(
      makeRequest("http://localhost/api/ontop", {
        method: "POST",
        body: invalidBody,
      })
    );
    assert.equal(invalidResponse.status, 400);
  }

  const filteredResponse = await ontopRoute.GET(
    makeRequest("http://localhost/api/ontop?type=clothing")
  );
  const filteredBody = await responseBody(filteredResponse);
  assert.ok(filteredBody.ontops.every((ontop) => ontop.type === "clothing"));

  const itemResponse = await ontopItemRoute.GET(makeRequest("http://localhost"), {
    params: Promise.resolve({ ontopId: body.id }),
  });
  assert.deepEqual(await responseBody(itemResponse), { ontop: storedOntop });

  const updateResponse = await ontopItemRoute.PUT(
    makeRequest("http://localhost", {
      method: "PUT",
      body: { type: "accessories", amount: 15 },
    }),
    { params: Promise.resolve({ ontopId: body.id }) }
  );
  assert.equal(updateResponse.status, 200);
  assert.deepEqual(ontops.get(body.id), {
    id: body.id,
    type: "accessories",
    amount: 15,
  });

  const malformedUpdateResponse = await ontopItemRoute.PUT(
    makeMalformedJsonRequest("http://localhost", "PUT"),
    { params: Promise.resolve({ ontopId: body.id }) }
  );
  assert.equal(malformedUpdateResponse.status, 400);

  const deleteResponse = await ontopItemRoute.DELETE({
    params: Promise.resolve({ ontopId: body.id }),
  });
  assert.equal(deleteResponse.status, 200);
  assert.equal(ontops.has(body.id), false);
});
