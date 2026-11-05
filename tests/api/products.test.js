import assert from "node:assert/strict";
import test from "node:test";

import { products } from "../../constants/index.js";
import * as productsRoute from "../../src/app/api/products/route.js";
import { makeRequest, responseBody } from "./helpers.js";

test("GET /api/products returns products and validates category filters", async () => {
  const allResponse = await productsRoute.GET(makeRequest("http://localhost/api/products"));
  const allBody = await responseBody(allResponse);

  assert.equal(allResponse.status, 200);
  assert.deepEqual(allBody.products, products);

  const filteredResponse = await productsRoute.GET(
    makeRequest("http://localhost/api/products?category=accessories")
  );
  const filteredBody = await responseBody(filteredResponse);

  assert.equal(filteredResponse.status, 200);
  assert.ok(filteredBody.products.length > 0);
  assert.ok(filteredBody.products.every((product) => product.category === "accessories"));

  const invalidResponse = await productsRoute.GET(
    makeRequest("http://localhost/api/products?category=unknown")
  );
  assert.equal(invalidResponse.status, 400);
});
