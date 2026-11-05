import { seasonals } from "../../../../../constants";
import { validateSeasonal } from "../../../../../validators";

export async function GET(request, { params }) {
  const { seasonalId } = await params;

  const seasonalIndex = seasonals.findIndex(
    (seasonal) => seasonal.id === seasonalId
  );

  if (seasonalIndex === -1) {
    return Response.json({ message: `Seasonal Not Found.` }, { status: 404 });
  }

  return Response.json({ seasonal: seasonals[seasonalIndex] });
}

export async function PUT(request, { params }) {
  const { type, amount } = await request.json();

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

  seasonals.splice(seasonalIndex, 1, { ...seasonal, type, amount });

  return Response.json({ message: `Update Success.` }, { status: 200 });
}

export async function PATCH(request, { params }) {
  const { seasonalId } = await params;

  const res = await request.json();
  return Response.json({ res });
}

export async function DELETE({ params }) {
  const { seasonalId } = await params;

  const seasonalIndex = seasonals.findIndex(
    (seasonal) => seasonal.id === seasonalId
  );

  if (seasonalIndex === -1) {
    return Response.json({ message: `Seasonal Not Found.` }, { status: 404 });
  }

  seasonals.splice(seasonalIndex, 1);

  return Response.json({ message: `Delete Success.` });
}
