export let orders = [];

let nextOrderId = Math.max(-1, ...orders.map(({ id }) => Number(id))) + 1;

export function allocateOrderId() {
  return String(nextOrderId++);
}
