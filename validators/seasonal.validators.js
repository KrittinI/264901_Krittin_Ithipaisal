export function validateSeasonal({ every, discount }) {
  let error = {};

  if (isNaN(every) || every < 0) {
    error.every = "INVALID_EVERY";
  }

  if (isNaN(discount) || discount < 0 || Number(discount) >= Number(every)) {
    error.discount = "INVALID_DISCOUNT";
  }

  if (Object.keys(error).length) {
    return error;
  }

  return null;
}
