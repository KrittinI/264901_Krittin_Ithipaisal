export async function GET(request, { params }) {
  const { orderId, seasonalId } = await params;
  return Response.json({ message: `Update Success.` }, { status: 200 });
}
