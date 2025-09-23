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
        position: 0,
        triggered: false,
        title: "Você é uma faísca solitária em um mundo de escuridão.",
        text: "Sua única motivação é que haja luz. \n O universo é vasto, frio e vazio, então viaje em busca de companhia. \n\nAproveite sua jornada.",
        choices: [{ text: "Viajar.", reward: 0 }],
      },
      {
        position: 50,
        triggered: false,
        title: "Era Briluz",
        text: "Em flashes de memórias, pequenos fragmentos de vidas passadas, você recebe as palavras. Uma torrente delas brota em você, borbulha. Por que não toma um nome para si, pequenino?",
        choices: [{ text: "Viajar.", reward: 0 }],
      },
    ],
  },
  second: { name: "2D", actual_distance: 0, max_distance: 1000, events: [] },
  third: { name: "3D", actual_distance: 0, max_distance: 10000, events: [] },
  fourty: { name: "4D", actual_distance: 0, max_distance: 100000, events: [] },
  five: { name: "5D", actual_distance: 0, max_distance: 1000000, events: [] },
};

export function upgradeStat(statName, lumens) {
  const stat = stats[statName];
  if (lumens >= stat.cost) {
    stat.level += 1;
    return stat.cost;
  }
  s;
  return 0;
}

const exponenciacao = 1.2;

export function getLumensPerSecond() {
  // Calcula lumens por segundo baseado no nível de 'intensity'
  return Math.floor(1 * Math.pow(exponenciacao, stats.intensity.level - 1));
}

export function getDistancePerSecond() {
  // A distância percorrida por segundo é igual ao nível de 'flux'
  return stats.flux.level;
}
