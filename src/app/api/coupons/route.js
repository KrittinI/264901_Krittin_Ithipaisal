import { COUPON_TYPE, coupons } from "../../../../constants/coupons";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  if (!type) {
    return Response.json({ coupons }, { status: 200 });
  }

  if (!COUPON_TYPE[type]) {
    return Response.json({ message: `Invalid type.` }, { status: 400 });
  }

  return Response.json({
    coupons: coupons.filter((coupon) => coupon.type === type),
  });
}

export async function POST(request) {
  const { type, amount } = await request.json();

  let error = {};

  if (!COUPON_TYPE[type]) {
    error.type = "INVALID_TYPE";
  }

  if (isNaN(amount) || amount < 0) {
    error.amount = "INVALID_AMOUNT";
  }

  if (type === COUPON_TYPE.percentage && !isNaN(amount) && amount >= 100) {
    error.amount = "INVALID_AMOUNT";
  }

  if (Object.keys(error).length) {
    return Response.json({ message: `Bad Request.`, error }, { status: 400 });
  }

  const id = coupons.push({ id: String(coupons.length), type, amount });

  return Response.json(
    { message: "Create coupon success.", id },
    { status: 201 }
  );
}
