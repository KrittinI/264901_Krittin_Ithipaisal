export async function GET(request, { params }) {
  const { seasonalId } = await params;
}

export async function PUT(request, { params }) {
  const { seasonalId } = await params;

  const res = await request.json();
  return Response.json({ res });
}
