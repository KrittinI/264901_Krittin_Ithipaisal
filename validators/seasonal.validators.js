export function validateSeasonal({ every, discount }) {
  const error = {};

  if (typeof every !== "number" || !Number.isFinite(every) || every < 0) {
    error.every = "INVALID_EVERY";
  }

  if (
    typeof discount !== "number" ||
    !Number.isFinite(discount) ||
    discount < 0 ||
    discount >= every
  ) {
    error.discount = "INVALID_DISCOUNT";
  }

  if (Object.keys(error).length) {
    return error;
  }

  return null;
}
