export async function GET(request, { params }) {
  const { couponId } = await params;
}

export async function PUT(request, { params }) {
  const { couponId } = await params;

  const res = await request.json();
  return Response.json({ res });
}
