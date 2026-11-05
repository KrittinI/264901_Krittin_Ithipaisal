import { coupons } from "../../../../../constants";
import { validateCoupon } from "../../../../../validators";

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

  const error = validateCoupon({ type, amount });

  if (error) {
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
