import { PRODUCT_CATEGORY, products } from "../../../../constants";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");

  if (category === null) {
    return Response.json({ products: Array.from(products.values()) }, { status: 200 });
  }

  if (!Object.hasOwn(PRODUCT_CATEGORY, category)) {
    return Response.json({ message: `Invalid category.` }, { status: 400 });
  }

  return Response.json(
    {
      products: Array.from(products.values()).filter(
        (product) => product.category === category
      ),
    },
    { status: 200 }
  );
}
