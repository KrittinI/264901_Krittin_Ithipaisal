import { products } from "../../../../constants/products";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("category");

  if (!query) {
    return Response.json({ products }).status(200);
  }

  return Response.json({
    products: products.filter((product) => product.category === query),
  }).status(200);
}
