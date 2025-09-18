export const stats = {
  flux: { level: 1, cost: 100 },
  intensity: { level: 1, cost: 100 },
  illuminance: { level: 1, cost: 100 },
  radiant: { level: 1, cost: 100 },
};

export const zonesOLD = {
  first: { actual_distance: 0, max_distance: 100 },
  second: { actual_distance: 0, max_distance: 1000 },
  third: { actual_distance: 0, max_distance: 10000 },
};

export const zones = {
  first: {
    name: "1D",
    actual_distance: 0,
    max_distance: 100,
    events: [
      {
        position: 0,
        triggered: false,
        text: "Texto de teste.",
        choices: [{ text: "Resposta 1" }, { text: "Resposta 2" }],
      },
    ],
  },
  second: { name: "2D", actual_distance: 0, max_distance: 1000, events: [] },
  third: { name: "3D", actual_distance: 0, max_distance: 10000, events: [] },
};

export function upgradeStat(statName, lumens) {
  const stat = stats[statName];
  if (lumens >= stat.cost) {
    stat.level += 1;
    return stat.cost;
  }
  return 0;
}
