export let coupons = [
  {
    id: "0",
    type: "fixed",
    amount: 20,
  },
  {
    id: "1",
    type: "fixed",
    amount: 20,
  },
  {
    id: "2",
    type: "fixed",
    amount: 200,
  },
  {
    id: "3",
    type: "percentage",
    amount: 20,
  },
  {
    id: "4",
    type: "percentage",
    amount: 20,
  },
  {
    id: "5",
    type: "percentage",
    amount: 20,
  },
  {
    id: "6",
    type: "percentage",
    amount: 25,
  },
  {
    id: "7",
    type: "fixed",
    amount: 25,
  },
];

let nextCouponId = Math.max(-1, ...coupons.map(({ id }) => Number(id))) + 1;

export function allocateCouponId() {
  return String(nextCouponId++);
}

export const COUPON_TYPE = {
  fixed: "fixed",
  percentage: "percentage",
};
