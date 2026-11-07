export async function PUT(request, { params }) {
  const body = await readJsonObject(request);
  if (!body) {
    return Response.json(
      { message: "Bad Request.", error: { body: "INVALID_JSON_OBJECT" } },
      { status: 400 }
    );
  }

  const { every, discount } = body;

  const { seasonalId } = await params;

  const seasonalIndex = seasonals.findIndex(
    (seasonal) => seasonal.id === seasonalId
  );

  if (seasonalIndex === -1) {
    return Response.json({ message: `Seasonal Not Found.` }, { status: 404 });
  }

  const error = validateSeasonal({ every, discount });

  if (error) {
    return Response.json({ message: `Bad Request.`, error }, { status: 400 });
  }

  const seasonal = seasonals[seasonalIndex];

  seasonals.splice(seasonalIndex, 1, { ...seasonal, every, discount });

  return Response.json({ message: `Update Success.` }, { status: 200 });
}
