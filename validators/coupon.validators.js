import { COUPON_TYPE } from "../constants";

export function validateCoupon({ amount, type }) {
  const error = {};

  if (!Object.hasOwn(COUPON_TYPE, type)) {
    error.type = "INVALID_TYPE";
  }

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) {
    error.amount = "INVALID_AMOUNT";
  }

  if (
    type === COUPON_TYPE.percentage &&
    typeof amount === "number" &&
    Number.isFinite(amount) &&
    amount >= 100
  ) {
    error.amount = "INVALID_AMOUNT";
  }

  if (Object.keys(error).length) {
    return error;
  }

  return null;
}
