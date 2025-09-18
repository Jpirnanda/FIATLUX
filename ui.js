import { stats, upgradeStat, zones } from "./game.js";

// Fly or eat logic
const flyButton = document.getElementById("fly-button");
const eatButton = document.getElementById("eat-button");
const lumensIndicator = document.getElementById("lumens-qnt");

let gameState = "fly";
let lumens = 0;
let eatInterval = null;
let flyInterval = null;
let currentZone = "first";

flyButton.addEventListener("click", () => {
  gameState = "fly";
  console.log("fly!");
  startFlying();
});

eatButton.addEventListener("click", () => {
  gameState = "eat";
  console.log("eat!");
  startEating();
});

//  Função para começar a comer lumens.
const exponenciacao = 1.2;

function getLumensPerSecond() {
  return Math.floor(1 * Math.pow(stats.intensity.level, exponenciacao));
}

function startEating() {
  if (eatInterval) {
    lumens += 1000;
    lumensIndicator.textContent = lumens + " lumens";
    return;
  }

  eatInterval = setInterval(() => {
    if (gameState === "eat") {
      lumens += getLumensPerSecond();
      lumensIndicator.textContent = lumens + " lumens";
    }
  }, 1000);
}

//  Função para voar.
const progressBar = document.getElementById("progress-bar");

function updateProgressBar() {
  const zone = zones[currentZone];
  const percent = Math.min(zone.actual_distance / zone.max_distance, 1) * 100;
  progressBar.style.width = percent + "%";
}

function getDistancePerSecond() {
  return Math.floor(1 * Math.pow(stats.flux.level, exponenciacao));
}

function startFlying() {
  if (flyInterval) return;

  flyInterval = setInterval(() => {
    if (gameState === "fly") {
      const zone = zones[currentZone];
      const dist = getDistancePerSecond();
      zone.actual_distance += dist;
      updateProgressBar();
      console.log(zone.actual_distance);

      // Chegou ao fim da zona?
      if (zone.actual_distance >= zone.max_distance) {
        clearInterval(flyInterval);
        flyInterval = null;
        // Avança para próxima zona, se existir
        if (currentZone === "first") currentZone = "second";
        else if (currentZone === "second") currentZone = "third";
        // Reinicia distância
        zones[currentZone].actual_distance = 0;
        updateProgressBar();
        // Mensagem de avanço de zona, se quiser
      }
    }
  }, 1000);
}

// Lógica para atualizar UI
const intensityLevel = document.querySelector(".stat:nth-child(1) .stat-value");
const intensityCost = document.querySelector(".stat:nth-child(1) #underline p");

const fluxLevel = document.querySelector(".stat:nth-child(2) .stat-value");
const fluxCost = document.querySelector(".stat:nth-child(2) #underline p");

const illuminanceLevel = document.querySelector(".stat:nth-child(3) .stat-value");
const illuminanceCost = document.querySelector(".stat:nth-child(3) #underline p");

const radiantLevel = document.querySelector(".stat:nth-child(4) .stat-value");
const radiantCost = document.querySelector(".stat:nth-child(4) #underline p");

const velocity = document.getElementById("speed");

function updateVelocityUI() {
  velocity.textContent = getDistancePerSecond() + " m/s";
}

function updateStatsUI() {
  fluxLevel.textContent = stats.flux.level + " lumen";
  fluxCost.textContent = stats.flux.cost;

  intensityLevel.textContent = stats.intensity.level + " candela";
  intensityCost.textContent = stats.intensity.cost;

  illuminanceLevel.textContent = stats.illuminance.level + " lux";
  illuminanceCost.textContent = stats.illuminance.cost;

  radiantLevel.textContent = stats.radiant.level + " watt";
  radiantCost.textContent = stats.radiant.cost;
}

fluxCost.addEventListener("click", () => {
  const cost = upgradeStat("flux", lumens);
  if (cost > 0) {
    lumens -= cost;
    updateStatsUI();
    updateVelocityUI();
    lumensIndicator.textContent = lumens + " lumens";
  }
});

intensityCost.addEventListener("click", () => {
  const cost = upgradeStat("intensity", lumens);
  if (cost > 0) {
    lumens -= cost;
    updateStatsUI();
    lumensIndicator.textContent = lumens + " lumens";
  }
});

illuminanceCost.addEventListener("click", () => {
  const cost = upgradeStat("illuminance", lumens);
  if (cost > 0) {
    lumens -= cost;
    updateStatsUI();
    lumensIndicator.textContent = lumens + " lumens";
  }
});

radiantCost.addEventListener("click", () => {
  const cost = upgradeStat("radiant", lumens);
  if (cost > 0) {
    lumens -= cost;
    updateStatsUI();
    lumensIndicator.textContent = lumens + " lumens";
  }
});

updateStatsUI();
updateProgressBar();
