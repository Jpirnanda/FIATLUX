import { upgradeStat, getDistancePerSecond } from "./game.js";
import { state, spendLumens } from "./state.js";
import { startFlying, startEating } from "./engine.js";
import { updateStatsUI, updateLumensUI, updateVelocityUI } from "./ui.js";

// Attaches listeners to buttons inside the .center div, which are recreated after events.
export function attachCenterPanelListeners() {
  console.log("  [listeners.js] Attaching listeners to .center panel (FLY/EAT)...");
  document.getElementById("fly-button").addEventListener("click", () => {
    console.log(">>> FLY button clicked!");
    state.gameState = "fly";
    startFlying();
  });
  document.getElementById("eat-button").addEventListener("click", () => {
    console.log(">>> EAT button clicked!");
    state.gameState = "eat";
    startEating();
  });
}

// Attaches listeners to the static upgrade buttons.
function attachUpgradeListeners() {
  const upgradeButtons = [
    { selector: ".stat:nth-child(1) #underline", name: "intensity" },
    { selector: ".stat:nth-child(2) #underline", name: "flux" },
    { selector: ".stat:nth-child(3) #underline", name: "illuminance" },
    { selector: ".stat:nth-child(4) #underline", name: "radiant" },
  ];

  upgradeButtons.forEach((btn) => {
    console.log(`  [listeners.js] Attaching listener for upgrade: ${btn.name}`);
    const button = document.querySelector(btn.selector);

    if (button) {
      button.addEventListener("click", (e) => {
        console.log(`>>> UPGRADE button clicked for: ${btn.name}`);
        const cost = upgradeStat(btn.name, state.lumens);
        if (cost > 0) {
          console.log(`    [listeners.js] Upgrade successful for ${btn.name}. Cost: ${cost}`);
          spendLumens(cost);
          updateStatsUI();
          updateLumensUI();
          if (btn.name === "flux") {
            updateVelocityUI(getDistancePerSecond());
          }
        } else {
          console.log(`    [listeners.js] Upgrade failed for ${btn.name}. Not enough lumens.`);
        }
      });
    } else {
      console.error(`  [listeners.js] Could not find button with selector: ${btn.selector}`);
    }
  });
}

export function initializeListeners() {
  console.log("%c[listeners.js] Initializing all listeners...", "color: orange;");
  attachCenterPanelListeners();
  attachUpgradeListeners();
  console.log("%c[listeners.js] All listeners initialized.", "color: orange;");
}
