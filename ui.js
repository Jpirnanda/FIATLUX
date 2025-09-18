import { stats, zones } from "./game.js";
import { state } from "./state.js";

// --- DOM Elements ---
const centerDiv = document.querySelector(".center");
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

export function showEventScreen(event, onChoiceSelected) {
  const choicesHTML = event.choices.map((choice, index) => `<button class="choice-button" data-choice-index="${index}">${choice.text}</button>`).join("");
  centerDiv.innerHTML = `
    <div id="event-screen">
      <h2>${event.text}</h2>
      <div id="event-choices">
        ${choicesHTML}
      </div>
    </div>`;
  document.querySelectorAll(".choice-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const choiceIndex = parseInt(e.target.dataset.choiceIndex, 10);
      onChoiceSelected(event.choices[choiceIndex]);
    });
  });
}

export function restoreMainScreen() {
  centerDiv.innerHTML = state.originalCenterHTML;
}

export function storeOriginalHTML() {
  state.originalCenterHTML = centerDiv.innerHTML;
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
    if (!event.triggered) {
      const marker = document.createElement("div");
      marker.className = "event-marker";
      marker.innerHTML = "★";
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
