export function makeRequest(url, { method = "GET", body } = {}) {
  const request = new Request(url, {
    method,
    ...(body === undefined
      ? {}
      : {
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        }),
  });

  Object.defineProperty(request, "nextUrl", { value: new URL(url) });
  return request;
}

export function makeMalformedJsonRequest(url, method = "POST") {
  const request = new Request(url, {
    method,
    headers: { "content-type": "application/json" },
    body: "{",
  });

  Object.defineProperty(request, "nextUrl", { value: new URL(url) });
  return request;
}

export function responseBody(response) {
  return response.json();
}
