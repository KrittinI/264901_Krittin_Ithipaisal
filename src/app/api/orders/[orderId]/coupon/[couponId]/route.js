export async function GET(request, { params }) {
  const { orderId, couponId } = await params;
  return Response.json({ message: `Update Success.` }, { status: 200 });
}
