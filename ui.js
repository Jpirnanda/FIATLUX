import { stats, upgradeStat, zones } from "./game.js";

// --- DOM Elements ---
const centerDiv = document.querySelector(".center");
const lumensIndicator = document.getElementById("lumens-qnt");
const progressBar = document.getElementById("progress-bar");
const progressSection = document.getElementById("progress-section");
const travelText = document.querySelector("#progress-section h2");
const velocity = document.getElementById("speed");

// --- Game State ---
let originalCenterHTML = ""; // Para guardar a tela principal
let gameState = "fly";
let lumens = 0;
let eatInterval = null;
let flyInterval = null;
let currentZone = "first";

//  Função para começar a comer lumens.
const exponenciacao = 1.2;

// --- Funções de Cálculo ---
function getLumensPerSecond() {
  // Calcula lumens por segundo baseado no nível de 'intensity'
  return Math.floor(10 * Math.pow(exponenciacao, stats.intensity.level - 1));
}

function getDistancePerSecond() {
  // A distância percorrida por segundo é igual ao nível de 'flux'
  return stats.flux.level;
}

// --- Funções de Loop de Jogo ---

function startEating() {
  if (eatInterval) {
    return;
  }
  // Para o voo se estivermos comendo
  clearInterval(flyInterval);
  flyInterval = null;

  eatInterval = setInterval(() => {
    if (gameState === "eat") {
      lumens += getLumensPerSecond();
      updateLumensUI();
    }
  }, 1000);
}

function startFlying() {
  if (flyInterval) {
    return;
  }
  // Para de comer se estivermos voando
  clearInterval(eatInterval);
  eatInterval = null;

  flyInterval = setInterval(() => {
    if (gameState === "fly") {
      const zone = zones[currentZone];
      const dist = getDistancePerSecond();
      zone.actual_distance += dist;
      updateProgressBar();

      // Verifica se alcançou um evento
      for (const event of zone.events) {
        if (!event.triggered && zone.actual_distance >= event.position) {
          event.triggered = true; // Marca como acionado
          triggerEvent(event);
          return; // Para o loop atual para mostrar o evento
        }
      }

      // Chegou ao fim da zona?
      if (zone.actual_distance >= zone.max_distance) {
        const zoneKeys = Object.keys(zones);
        const currentZoneIndex = zoneKeys.indexOf(currentZone);
        if (currentZoneIndex < zoneKeys.length - 1) {
          zone.actual_distance = 0; // Reseta a distância da zona anterior
          currentZone = zoneKeys[currentZoneIndex + 1];
          zones[currentZone].actual_distance = 0; // Garante que a nova zona comece do zero
          updateAllUI();
          renderEventMarkers();
        } else {
          clearInterval(flyInterval);
          flyInterval = null;
          console.log("Você viajou por todas as zonas!");
        }
      }
    }
  }, 1000);
}

// --- Lógica de Eventos ---
function triggerEvent(event) {
  // Pausa o jogo
  clearInterval(flyInterval);
  flyInterval = null;

  // Cria o HTML para as escolhas do evento
  const choicesHTML = event.choices.map((choice, index) => `<button class="choice-button" data-choice-index="${index}">${choice.text}</button>`).join("");

  // Substitui o centro da tela pela tela do evento
  centerDiv.innerHTML = `
    <div id="event-screen">
      <h2>${event.text}</h2>
      <div id="event-choices">
        ${choicesHTML}
      </div>
    </div>
  `;

  // Adiciona listeners aos botões de escolha
  document.querySelectorAll(".choice-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const choiceIndex = parseInt(e.target.dataset.choiceIndex, 10);
      resolveEvent(event.choices[choiceIndex]);
    });
  });
}

function resolveEvent(choice) {
  // Aplica a recompensa da escolha
  if (choice.reward && choice.reward.lumens) {
    lumens += choice.reward.lumens;
  }

  // Restaura a tela principal
  centerDiv.innerHTML = originalCenterHTML;
  attachMainListeners(); // Re-adiciona os listeners aos botões
  updateAllUI(); // Atualiza toda a UI
  renderEventMarkers(); // Renderiza os marcadores novamente

  // Continua o jogo
  if (gameState === "fly") {
    startFlying();
  }
}

// --- Funções de UI ---

function updateProgressBar() {
  const zone = zones[currentZone];
  const progress = (zone.actual_distance / zone.max_distance) * 100;
  progressBar.style.width = `${progress}%`;
}

function updateLumensUI() {
  lumensIndicator.textContent = lumens + " lumens";
}

function updateVelocityUI() {
  velocity.textContent = getDistancePerSecond() + " m/s";
}

function updateTravelText() {
  travelText.textContent = `Travelling in ${zones[currentZone].name}`;
}

function updateStatsUI() {
  // Seleciona os elementos novamente pois eles podem ter sido recriados
  document.querySelector(".stat:nth-child(1) .stat-value").textContent = stats.intensity.level + " candela";
  document.querySelector(".stat:nth-child(1) #underline p").textContent = stats.intensity.cost;
  document.querySelector(".stat:nth-child(2) .stat-value").textContent = stats.flux.level + " lumen";
  document.querySelector(".stat:nth-child(2) #underline p").textContent = stats.flux.cost;
  document.querySelector(".stat:nth-child(3) .stat-value").textContent = stats.illuminance.level + " lux";
  document.querySelector(".stat:nth-child(3) #underline p").textContent = stats.illuminance.cost;
  document.querySelector(".stat:nth-child(4) .stat-value").textContent = stats.radiant.level + " watt";
  document.querySelector(".stat:nth-child(4) #underline p").textContent = stats.radiant.cost;
}

function renderEventMarkers() {
  // Limpa marcadores antigos
  document.querySelectorAll(".event-marker").forEach((marker) => marker.remove());

  const zone = zones[currentZone];
  zone.events.forEach((event) => {
    if (!event.triggered) {
      const marker = document.createElement("div");
      marker.className = "event-marker";
      marker.innerHTML = "★"; // Ícone de estrela
      const percent = (event.position / zone.max_distance) * 100;
      marker.style.left = `${percent}%`;
      progressSection.appendChild(marker);
    }
  });
}

function updateAllUI() {
  updateStatsUI();
  updateProgressBar();
  updateVelocityUI();
  updateLumensUI();
  updateTravelText();
}

// --- Inicialização e Listeners ---

function attachMainListeners() {
  // É preciso re-selecionar os elementos pois eles são recriados ao voltar de um evento
  document.getElementById("fly-button").addEventListener("click", () => {
    gameState = "fly";
    startFlying();
  });

  document.getElementById("eat-button").addEventListener("click", () => {
    gameState = "eat";
    startEating();
  });

  const upgradeButtons = [
    { selector: ".stat:nth-child(2) #underline", name: "flux" },
    { selector: ".stat:nth-child(1) #underline", name: "intensity" },
    { selector: ".stat:nth-child(3) #underline", name: "illuminance" },
    { selector: ".stat:nth-child(4) #underline", name: "radiant" },
  ];

  upgradeButtons.forEach((btn) => {
    document.querySelector(btn.selector).addEventListener("click", () => {
      const cost = upgradeStat(btn.name, lumens);
      if (cost > 0) {
        lumens -= cost;
        updateStatsUI();
        updateLumensUI();
        if (btn.name === "flux") updateVelocityUI();
      }
    });
  });
}

function initializeGame() {
  originalCenterHTML = centerDiv.innerHTML; // Salva o HTML da tela principal
  attachMainListeners();
  updateAllUI();
  renderEventMarkers();
  if (gameState === "fly") startFlying();
}

initializeGame();
