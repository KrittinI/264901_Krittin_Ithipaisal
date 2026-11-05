import { allocateOntopId, ONTOP_TYPE, ontops } from "../../../../constants";
import { validateOntop } from "../../../../validators";
import { readJsonObject } from "../_utils/request";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  if (!type) {
    return Response.json({ ontops }, { status: 200 });
  }

  if (!Object.hasOwn(ONTOP_TYPE, type)) {
    return Response.json({ message: `Invalid type.` }, { status: 400 });
  }

  return Response.json({
    ontops: ontops.filter((ontop) => ontop.type === type),
  });
}

export async function POST(request) {
  const body = await readJsonObject(request);
  if (!body) {
    return Response.json(
      { message: "Bad Request.", error: { body: "INVALID_JSON_OBJECT" } },
      { status: 400 }
    );
  }

  const { type, amount } = body;

  const error = validateOntop({ amount, type });

  if (error) {
    return Response.json({ message: `Bad Request.`, error }, { status: 400 });
  }

  const id = allocateOntopId();
  ontops.push({ id, type, amount });

  return Response.json(
    { message: "Create ontop success.", id },
    { status: 201 }
  );
}
