import { seasonals } from "../../../../../constants";
import { validateSeasonal } from "../../../../../validators";
import { readJsonObject } from "../../_utils/request";

export async function GET(request, { params }) {
  const { seasonalId } = await params;

  const seasonal = seasonals.get(seasonalId);

  if (!seasonal) {
    return Response.json({ message: `Seasonal Not Found.` }, { status: 404 });
  }

  return Response.json({ seasonal });
}

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

  const seasonal = seasonals.get(seasonalId);

  if (!seasonal) {
    return Response.json({ message: `Seasonal Not Found.` }, { status: 404 });
  }

  const error = validateSeasonal({ every, discount });

  if (error) {
    return Response.json({ message: `Bad Request.`, error }, { status: 400 });
  }

  seasonals.set(seasonalId, { ...seasonal, every, discount });

  return Response.json({ message: `Update Success.` }, { status: 200 });
}

export async function DELETE({ params }) {
  const { seasonalId } = await params;

  if (!seasonals.has(seasonalId)) {
    return Response.json({ message: `Seasonal Not Found.` }, { status: 404 });
  }

  seasonals.delete(seasonalId);

  return Response.json({ message: `Delete Success.` });
}
