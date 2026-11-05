import { allocateSeasonalId, seasonals } from "../../../../constants";
import { validateSeasonal } from "../../../../validators";
import { readJsonObject } from "../_utils/request";

export async function GET(request) {
  return Response.json({ seasonals });
}

export async function POST(request) {
  const body = await readJsonObject(request);
  if (!body) {
    return Response.json(
      { message: "Bad Request.", error: { body: "INVALID_JSON_OBJECT" } },
      { status: 400 }
    );
  }

  const { every, discount } = body;

  const error = validateSeasonal({ every, discount });

  if (error) {
    return Response.json({ message: `Bad Request.`, error }, { status: 400 });
  }

  const id = allocateSeasonalId();
  seasonals.push({ id, every, discount });

  return Response.json(
    { message: "Create seasonal success.", id },
    { status: 201 }
  );
}
