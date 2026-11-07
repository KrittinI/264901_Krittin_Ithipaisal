import { allocateCouponId, COUPON_TYPE, coupons } from "../../../../constants";
import { validateCoupon } from "../../../../validators";
import { readJsonObject } from "../_utils/request";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  if (!type) {
    return Response.json({ coupons: Array.from(coupons.values()) }, { status: 200 });
  }

  if (!Object.hasOwn(COUPON_TYPE, type)) {
    return Response.json({ message: `Invalid type.` }, { status: 400 });
  }

  return Response.json({
    coupons: Array.from(coupons.values()).filter((coupon) => coupon.type === type),
  });
}

export async function POST(request) {
  const body = await readJsonObject(request);
  if (!body) {
    return Response.json(
      { message: "Bad Request.", error: { body: "INVALID_JSON_OBJECT" } },
      { status: 400 }
    );
  }

  const { type, amount } = body;

  const error = validateCoupon({ type, amount });

  if (error) {
    return Response.json({ message: `Bad Request.`, error }, { status: 400 });
  }

  const id = allocateCouponId();
  coupons.set(id, { id, type, amount });

  return Response.json(
    { message: "Create coupon success.", id },
    { status: 201 }
  );
}
