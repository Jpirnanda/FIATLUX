export const stats = {
  flux: { level: 1, cost: 100 },
  intensity: { level: 1, cost: 100 },
  illuminance: { level: 1, cost: 100 },
  radiant: { level: 1, cost: 100 },
};

export const zones = {
  first: {
    name: "1D",
    actual_distance: 0,
    max_distance: 100,
    events: [
      {
        position: 50,
        triggered: false,
        text: "Texto de teste.",
        choices: [
          { text: "Ganhar 200 lumens", reward: { lumens: 200 } },
          { text: "Ignorar", reward: {} },
        ],
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

const exponenciacao = 1.2;

export function getLumensPerSecond() {
  // Calcula lumens por segundo baseado no nível de 'intensity'
  return Math.floor(10 * Math.pow(exponenciacao, stats.intensity.level - 1));
}

export function getDistancePerSecond() {
  // A distância percorrida por segundo é igual ao nível de 'flux'
  return stats.flux.level;
}
