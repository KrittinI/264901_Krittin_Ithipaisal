export async function GET(request, { params }) {
  const { seasonalId } = await params;
  return Response.json({ seasonalId });
}

export async function PUT(request, { params }) {
  const { seasonalId } = await params;

  const res = await request.json();
  return Response.json({ res });
}

export async function PATCH(request, { params }) {
  const { seasonalId } = await params;

  const res = await request.json();
  return Response.json({ res });
}
