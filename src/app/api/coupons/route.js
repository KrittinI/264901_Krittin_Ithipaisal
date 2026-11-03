export async function GET(request) {
  return Response.json({});
}

export async function POST(request) {
  const res = await request.json();
  return Response.json({ res });
}
