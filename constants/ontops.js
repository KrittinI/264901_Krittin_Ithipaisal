const initialOntops = [
  {
    id: "0",
    type: "clothing",
    amount: 25,
  },
  {
    id: "1",
    type: "accessories",
    amount: 40,
  },
  {
    id: "2",
    type: "electronics",
    amount: 15,
  },
  {
    id: "3",
    type: "points",
    amount: 20,
  },
];

export const ontops = new Map(initialOntops.map((ontop) => [ontop.id, ontop]));

let nextOntopId = Math.max(-1, ...Array.from(ontops.keys(), Number)) + 1;

export function allocateOntopId() {
  return String(nextOntopId++);
}

export const ONTOP_TYPE = {
  clothing: "clothing",
  accessories: "accessories",
  electronics: "electronics",
  points: "points",
};
