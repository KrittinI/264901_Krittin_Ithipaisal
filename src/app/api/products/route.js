import { PRODUCT_CATEGORY, products } from "../../../../constants/products";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");

  if (!category) {
    return Response.json({ products }, { status: 200 });
  }

  if (!PRODUCT_CATEGORY[category]) {
    return Response.json({ message: `Invalid category.` }, { status: 400 });
  }

  return Response.json(
    {
      products: products.filter((product) => product.category === category),
    },
    { status: 200 }
  );
}
