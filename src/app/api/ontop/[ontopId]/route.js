export async function GET(request, { params }) {
    const { ontopId } = await params;
    return Response.json({ ontopId });
  }
  
  export async function PUT(request, { params }) {
    const { ontopId } = await params;
  
    const res = await request.json();
    return Response.json({ res });
  }
  
  
  export async function PATCH(request, { params }) {
    const { ontopId } = await params;
  
    const res = await request.json();
    return Response.json({ res });
  }
  