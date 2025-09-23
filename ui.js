import { stats, zones } from "./game.js";
import { state } from "./state.js";
import { iconTemplates } from "./templates.js";

const mainFrame = document.getElementById("main-frame");
const displayDiv = document.getElementById("display");
// --- DOM Elements ---
const lumensIndicator = document.getElementById("lumens-qnt");
const progressBar = document.getElementById("progress-bar");
const progressSection = document.getElementById("progress-section");
const travelText = document.querySelector("#progress-section h2");
const velocity = document.getElementById("speed");

// --- Funções de UI ---
export function updateProgressBar() {
  const zone = zones[state.currentZone];
  const progress = (zone.actual_distance / zone.max_distance) * 100;
  progressBar.style.width = `${progress}%`;
}

export function updateLumensUI() {
  lumensIndicator.textContent = state.lumens + " lumens";
}

export function updateVelocityUI(speed) {
  velocity.textContent = speed + " m/s";
}

export function updateTravelText() {
  travelText.textContent = `Travelling in ${zones[state.currentZone].name}`;
}

// Função para mostrar a tela de evento
export function showEventScreen(event, onChoiceSelected) {
  console.log("  [ui.js] Showing event screen...");
  mainFrame.classList.add("hidden");

  const choicesHTML = event.choices.map((choice, index) => `<button class="choice-button" data-choice-index="${index}">${choice.text}</button>`).join("");

  // Create a new div for the event screen
  const eventScreen = document.createElement("div");
  eventScreen.id = "event-screen";
  eventScreen.innerHTML = `
      <h1>${event.title}</h1>
      <h2>${event.text}</h2>
      <div id="event-choices">
        ${choicesHTML}
      </div>
    `;

  // Append the new screen to the display area
  displayDiv.appendChild(eventScreen);

  // Attach listeners to the new buttons
  eventScreen.querySelectorAll(".choice-button").forEach((button) => {
    console.log("    [ui.js] Attaching listener to choice button:", button.textContent);
    button.addEventListener("click", (e) => {
      console.log(">>> Event choice button clicked:", e.target.textContent);
      const choiceIndex = parseInt(e.target.dataset.choiceIndex, 10);
      onChoiceSelected(event.choices[choiceIndex]);
    });
  });
}

export function restoreMainScreen() {
  console.log("  [ui.js] Restoring main screen...");
  const eventScreen = document.getElementById("event-screen");
  if (eventScreen) {
    eventScreen.remove();
  }
  mainFrame.classList.remove("hidden");
}

export function storeOriginalHTML() {
  // This function is no longer needed with the show/hide approach.
  console.log("  [ui.js] storeOriginalHTML is deprecated.");
}

export function updateStatsUI() {
  document.querySelector(".stat:nth-child(1) .stat-value").textContent = stats.intensity.level + " candela";
  document.querySelector(".stat:nth-child(1) #underline p").textContent = stats.intensity.cost;
  document.querySelector(".stat:nth-child(2) .stat-value").textContent = stats.flux.level + " lumen";
  document.querySelector(".stat:nth-child(2) #underline p").textContent = stats.flux.cost;
  document.querySelector(".stat:nth-child(3) .stat-value").textContent = stats.illuminance.level + " lux";
  document.querySelector(".stat:nth-child(3) #underline p").textContent = stats.illuminance.cost;
  document.querySelector(".stat:nth-child(4) .stat-value").textContent = stats.radiant.level + " watt";
  document.querySelector(".stat:nth-child(4) #underline p").textContent = stats.radiant.cost;
}

export function renderEventMarkers() {
  document.querySelectorAll(".event-marker").forEach((marker) => marker.remove());
  const zone = zones[state.currentZone];
  zone.events.forEach((event) => {
    // Renderiza todos os marcadores, mas aplica uma classe se já foi acionado
    if (iconTemplates.star) {
      const marker = document.createElement("div");
      marker.className = "event-marker";

      if (event.triggered) {
        marker.classList.add("triggered");
      }

      // Clona o nó do SVG em vez de criar um <i> e chamar a biblioteca
      const icon = iconTemplates.star.cloneNode(true);
      marker.appendChild(icon);

      const percent = (event.position / zone.max_distance) * 100;
      marker.style.left = `${percent}%`;
      progressSection.appendChild(marker);
    }
  });
}

export function updateAllUI(speed) {
  updateStatsUI();
  updateProgressBar();
  updateVelocityUI(speed);
  updateLumensUI();
  updateTravelText();
}
