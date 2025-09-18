import { upgradeStat, getDistancePerSecond } from "./game.js";
import { state, spendLumens } from "./state.js";
import { startFlying, startEating } from "./engine.js";
import { updateStatsUI, updateLumensUI, updateVelocityUI } from "./ui.js";

export function attachMainListeners() {
  // É preciso re-selecionar os elementos pois eles são recriados ao voltar de um evento
  document.getElementById("fly-button").addEventListener("click", () => {
    state.gameState = "fly";
    startFlying();
  });

  document.getElementById("eat-button").addEventListener("click", () => {
    state.gameState = "eat";
    startEating();
  });

  const upgradeButtons = [
    { selector: ".stat:nth-child(1) #underline", name: "intensity" },
    { selector: ".stat:nth-child(2) #underline", name: "flux" },
    { selector: ".stat:nth-child(3) #underline", name: "illuminance" },
    { selector: ".stat:nth-child(4) #underline", name: "radiant" },
  ];

  upgradeButtons.forEach((btn) => {
    document.querySelector(btn.selector).addEventListener("click", () => {
      const cost = upgradeStat(btn.name, state.lumens);
      if (cost > 0) {
        spendLumens(cost);
        updateStatsUI();
        updateLumensUI();
        if (btn.name === "flux") {
          updateVelocityUI(getDistancePerSecond());
        }
      }
    });
  });
}
