import { COUPON_TYPE, coupons } from "../../../../constants";
import { validateCoupon } from "../../../../validators";

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

  const error = validateCoupon({ type, amount });

  if (error) {
    return Response.json({ message: `Bad Request.`, error }, { status: 400 });
  }

  const id = coupons.push({ id: String(coupons.length), type, amount });

  return Response.json(
    { message: "Create coupon success.", id },
    { status: 201 }
  );
}
