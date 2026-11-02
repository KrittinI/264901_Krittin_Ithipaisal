export async function GET(request, { params }) {
  const { orderId } = await params;
}

export async function PUT(request, { params }) {
  const { orderId } = await params;

  const res = await request.json();
  return Response.json({ res });
}
