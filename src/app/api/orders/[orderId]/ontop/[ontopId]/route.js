export async function GET(request, { params }) {
  const { orderId, ontopId } = await params;
  return Response.json({ message: `Update Success.` }, { status: 200 });
}
