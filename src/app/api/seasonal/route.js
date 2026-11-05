import { seasonals } from "../../../../constants";
import { validateSeasonal } from "../../../../validators";

export async function GET(request) {
  return Response.json({ seasonals });
}

export async function POST(request) {
  const { every, discount } = await request.json();

  const error = validateSeasonal({ every, discount });

  if (error) {
    return Response.json({ message: `Bad Request.`, error }, { status: 400 });
  }

  const id = seasonals.push({ id: String(seasonals.length), every, discount });

  return Response.json(
    { message: "Create seasonal success.", id },
    { status: 201 }
  );
}
