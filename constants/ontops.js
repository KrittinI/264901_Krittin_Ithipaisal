export let ontops = [
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

let nextOntopId = Math.max(-1, ...ontops.map(({ id }) => Number(id))) + 1;

export function allocateOntopId() {
  return String(nextOntopId++);
}

export const ONTOP_TYPE = {
  clothing: "clothing",
  accessories: "accessories",
  electronics: "electronics",
  points: "points",
};
