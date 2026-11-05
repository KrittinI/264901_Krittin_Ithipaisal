export const seasonals = [
  {
    id: "0",
    every: "20",
    discount: "1",
  },
  {
    id: "1",
    every: "200",
    discount: "5",
  },
  {
    id: "2",
    every: "500",
    discount: "15",
  },
];

let nextSeasonalId = Math.max(-1, ...seasonals.map(({ id }) => Number(id))) + 1;

export function allocateSeasonalId() {
  return String(nextSeasonalId++);
}
