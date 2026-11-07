export const orders = new Map();

let nextOrderId = 0;

export function allocateOrderId() {
  return String(nextOrderId++);
}
