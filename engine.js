import { getDistancePerSecond, getLumensPerSecond, zones } from "./game.js";
import { state, addLumens } from "./state.js";
import { updateProgressBar, updateLumensUI, showEventScreen, restoreMainScreen, updateAllUI, renderEventMarkers } from "./ui.js";
import { initializeListeners, attachCenterPanelListeners } from "./listeners.js";
import { iconTemplates } from "./templates.js";

export function startEating() {
  if (state.eatInterval) {
    addLumens(100);
    updateLumensUI();
    return;
  }

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
  console.log("%c[engine.js] TRIGGERING EVENT", "color: yellow; font-weight: bold;", event);
  clearInterval(state.flyInterval);
  state.flyInterval = null;
  console.log("[engine.js] Fly interval cleared.");
  showEventScreen(event, resolveEvent);
}

function resolveEvent(choice) {
  console.log("%c[engine.js] RESOLVING EVENT with choice:", "color: yellow; font-weight: bold;", choice);
  if (choice.reward && choice.reward.lumens) {
    addLumens(choice.reward.lumens);
  }

  console.log("[engine.js] 1. Restoring main screen...");
  restoreMainScreen();
  console.log("[engine.js] 2. Updating all UI elements...");
  updateAllUI(getDistancePerSecond());
  console.log("[engine.js] 3. Rendering event markers...");
  renderEventMarkers();

  if (state.gameState === "fly") {
    console.log("[engine.js] 4. Game state is 'fly', restarting flight...");
    startFlying();
  }
  // Listeners no longer need to be re-initialized because the main screen was not destroyed.
  console.log("%c[engine.js] Event resolution complete. UI updated.", "color: yellow; font-weight: bold;");
}

export function initializeGame() {
  console.log("%c[engine.js] INITIALIZING GAME...", "color: cyan; font-weight: bold;");
  // Renderiza todos os ícones da página UMA ÚNICA VEZ, ANTES de qualquer outra coisa.
  // Isso garante que o DOM esteja estável antes de salvarmos o HTML ou adicionarmos listeners.
  console.log("[engine.js] Initializing Lucide icons...");
  lucide.createIcons();

  initializeListeners();

  // Guarda o SVG do ícone de evento para ser usado como template.
  const starTemplate = document.querySelector("#icon-templates svg");
  if (starTemplate) {
    console.log("[engine.js] Storing SVG icon template for 'star'.");
    iconTemplates.star = starTemplate;
  } else {
    console.error("[engine.js] Could not find the 'star' icon template to store!");
  }

  updateAllUI(getDistancePerSecond());
  renderEventMarkers();
  if (state.gameState === "fly") {
    console.log("[engine.js] Initial game state is 'fly', starting flight.");
    startFlying();
  }
}
