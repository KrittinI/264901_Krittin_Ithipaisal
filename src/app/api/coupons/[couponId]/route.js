export async function GET(request, { params }) {
  const { couponId } = await params;
  return Response.json({ couponId });
}

export async function PUT(request, { params }) {
  const { couponId } = await params;

  const res = await request.json();
  return Response.json({ res });
}

export async function PATCH(request, { params }) {
  const { couponId } = await params;

  const res = await request.json();
  return Response.json({ res });
}
