import { ONTOP_TYPE } from "../constants";

export function validateOntop({ amount, type }) {
  let error = {};

  if (!ONTOP_TYPE[type]) {
    error.type = "INVALID_TYPE";
  }

  if (type !== ONTOP_TYPE.points) {
    if (isNaN(amount) || amount < 0 || amount >= 100) {
      error.amount = "INVALID_AMOUNT";
    }
  } else {
    amount = 20;
  }

  if (Object.keys(error).length) {
    return error;
  }

  return null;
}
