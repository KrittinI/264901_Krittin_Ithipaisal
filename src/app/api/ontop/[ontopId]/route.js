export async function GET(request, { params }) {
    const { ontopId } = await params;
  }
  
  export async function PUT(request, { params }) {
    const { ontopId } = await params;
  
    const res = await request.json();
    return Response.json({ res });
  }
  