import { getDistancePerSecond, getLumensPerSecond, zones } from "./game.js";
import { state, addLumens } from "./state.js";
import { updateProgressBar, updateLumensUI, showEventScreen, restoreMainScreen, updateAllUI, renderEventMarkers, storeOriginalHTML } from "./ui.js";
import { attachMainListeners } from "./listeners.js";

export function startEating() {
  if (state.eatInterval) return;

  clearInterval(state.flyInterval);
  state.flyInterval = null;

  state.eatInterval = setInterval(() => {
    if (state.gameState === "eat") {
      addLumens(getLumensPerSecond());
      updateLumensUI();
    }
  }, 1000);
}

export function startFlying() {
  if (state.flyInterval) return;

  clearInterval(state.eatInterval);
  state.eatInterval = null;

  state.flyInterval = setInterval(() => {
    if (state.gameState === "fly") {
      const zone = zones[state.currentZone];
      zone.actual_distance += getDistancePerSecond();
      updateProgressBar();

      for (const event of zone.events) {
        if (!event.triggered && zone.actual_distance >= event.position) {
          event.triggered = true;
          triggerEvent(event);
          return;
        }
      }

      if (zone.actual_distance >= zone.max_distance) {
        const zoneKeys = Object.keys(zones);
        const currentZoneIndex = zoneKeys.indexOf(state.currentZone);
        if (currentZoneIndex < zoneKeys.length - 1) {
          zone.actual_distance = 0;
          state.currentZone = zoneKeys[currentZoneIndex + 1];
          zones[state.currentZone].actual_distance = 0;
          updateAllUI(getDistancePerSecond());
          renderEventMarkers();
        } else {
          clearInterval(state.flyInterval);
          state.flyInterval = null;
          console.log("Você viajou por todas as zonas!");
        }
      }
    }
  }, 1000);
}

function triggerEvent(event) {
  clearInterval(state.flyInterval);
  state.flyInterval = null;
  showEventScreen(event, resolveEvent);
}

function resolveEvent(choice) {
  if (choice.reward && choice.reward.lumens) {
    addLumens(choice.reward.lumens);
  }

  restoreMainScreen();
  attachMainListeners();
  updateAllUI(getDistancePerSecond());
  renderEventMarkers();

  if (state.gameState === "fly") {
    startFlying();
  }
}

export function initializeGame() {
  storeOriginalHTML();
  attachMainListeners();
  updateAllUI(getDistancePerSecond());
  renderEventMarkers();
  if (state.gameState === "fly") {
    startFlying();
  }
}
