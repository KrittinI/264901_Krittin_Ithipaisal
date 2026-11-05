import { ontops } from "../../../../../constants/ontops";

export async function GET(request, { params }) {
  const { ontopId } = await params;

  const ontopIndex = ontops.findIndex((ontop) => ontop.id === ontopId);

  if (ontopIndex === -1) {
    return Response.json({ message: `Ontop Not Found.` }, { status: 404 });
  }

  return Response.json({ ontop: ontops[ontopIndex] });
}

export async function PUT(request, { params }) {
  const { type, amount } = await request.json();
  const { ontopId } = await params;

  const ontopIndex = ontops.findIndex((ontop) => ontop.id === ontopId);

  if (ontopIndex === -1) {
    return Response.json({ message: `Ontop Not Found.` }, { status: 404 });
  }

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

  const ontop = ontops[ontopIndex];

  ontops.splice(ontopIndex, 1, { ...ontop, type, amount });

  return Response.json({ message: `Update Success.` }, { status: 200 });
}

export async function PATCH(request, { params }) {
  const { ontopId } = await params;

  const res = await request.json();
  return Response.json({ res });
}

export async function DELETE({ params }) {
  const { ontopId } = await params;

  const ontopIndex = ontops.findIndex((ontop) => ontop.id === ontopId);

  if (ontopIndex === -1) {
    return Response.json({ message: `Ontop Not Found.` }, { status: 404 });
  }

  ontops.splice(ontopIndex, 1);

  return Response.json({ message: `Delete Success.` });
}
