import { seasonals } from "../../../../constants/seasonal";

export async function GET(request) {
  return Response.json({ seasonals });
}

export async function POST(request) {
  const { every, discount } = await request.json();

  let error = {};

  if (isNaN(every) || every < 0) {
    error.every = "INVALID_EVERY";
  }

  if (isNaN(discount) || discount < 0 || Number(discount) >= Number(every)) {
    error.discount = "INVALID_DISCOUNT";
  }

  if (Object.keys(error).length) {
    return Response.json({ message: `Bad Request.`, error }, { status: 400 });
  }

  const id = seasonals.push({ id: String(seasonals.length), every, discount });

  return Response.json(
    { message: "Create seasonal success.", id },
    { status: 201 }
  );
}
