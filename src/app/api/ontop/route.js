import { ONTOP_TYPE, ontops } from "../../../../constants/ontops";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  if (!type) {
    return Response.json({ ontops }, { status: 200 });
  }

  if (!ONTOP_TYPE[type]) {
    return Response.json({ message: `Invalid type.` }, { status: 400 });
  }

  return Response.json({
    ontops: ontops.filter((ontop) => ontop.type === type),
  });
}

export async function POST(request) {
  let { type, amount } = await request.json();

  let error = {};

  if (!ONTOP_TYPE[type]) {
    error.type = "INVALID_TYPE";
  }

  if (type !== ONTOP_TYPE.points) {
    if (isNaN(amount) || amount < 0 || amount >= 100) {
      error.amount = "INVALID_AMOUNT";
    }
  } else {
    amount = 20;
  }

  if (Object.keys(error).length) {
    return Response.json({ message: `Bad Request.`, error }, { status: 400 });
  }

  const id = ontops.push({ id: String(ontops.length), type, amount });

  return Response.json(
    { message: "Create ontop success.", id },
    { status: 201 }
  );
}
