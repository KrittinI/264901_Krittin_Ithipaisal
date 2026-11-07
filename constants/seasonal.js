const initialSeasonals = [
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

export const seasonals = new Map(
  initialSeasonals.map((seasonal) => [seasonal.id, seasonal])
);

let nextSeasonalId = Math.max(-1, ...Array.from(seasonals.keys(), Number)) + 1;

export function allocateSeasonalId() {
  return String(nextSeasonalId++);
}
