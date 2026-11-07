const initialProducts = [
  {
    id: "1",
    name: "T-Shirt",
    category: "clothing",
    price: 350,
  },
  {
    id: "2",
    name: "Hat",
    category: "accessories",
    price: 250,
  },
  {
    id: "3",
    name: "Hoodie",
    category: "clothing",
    price: 700,
  },
  {
    id: "4",
    name: "Watch",
    category: "electronics",
    price: 850,
  },
  {
    id: "5",
    name: "Bag",
    category: "accessories",
    price: 640,
  },
  {
    id: "6",
    name: "Belt",
    category: "accessories",
    price: 230,
  },
  {
    id: "7",
    name: "Shoes",
    category: "clothing",
    price: 1200,
  },
];

export const products = new Map(
  initialProducts.map((product) => [product.id, product])
);

export const PRODUCT_CATEGORY = {
  clothing: "clothing",
  accessories: "accessories",
  electronics: "electronics",
};
