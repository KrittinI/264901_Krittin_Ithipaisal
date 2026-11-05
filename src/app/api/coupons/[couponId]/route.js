import { COUPON_TYPE, coupons } from "../../../../../constants/coupons";

export async function GET(request, { params }) {
  const { couponId } = await params;

  const couponIndex = coupons.findIndex((coupon) => coupon.id === couponId);

  if (couponIndex === -1) {
    return Response.json({ message: `Coupon Not Found.` }, { status: 404 });
  }

  return Response.json({ coupon: coupons[couponIndex] });
}

export async function PUT(request, { params }) {
  const { type, amount } = await request.json();

  const { couponId } = await params;

  const couponIndex = coupons.findIndex((coupon) => coupon.id === couponId);

  if (couponIndex === -1) {
    return Response.json({ message: `Coupon Not Found.` }, { status: 404 });
  }

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

  const coupon = coupons[couponIndex];

  coupons.splice(couponIndex, 1, { ...coupon, type, amount });

  return Response.json({ message: `Update Success.` }, { status: 200 });
}

export async function PATCH(request, { params }) {
  const { couponId } = await params;

  const res = await request.json();
  return Response.json({ res });
}

export async function DELETE({ params }) {
  const { couponId } = await params;

  const couponIndex = coupons.findIndex((coupon) => coupon.id === couponId);

  if (couponIndex === -1) {
    return Response.json({ message: `Coupon Not Found.` }, { status: 404 });
  }

  coupons.splice(couponIndex, 1);

  return Response.json({ message: `Delete Success.` });
}
