export const state = {
  lumens: 0,
  gameState: "fly", // 'fly' or 'eat'
  currentZone: "first",
  eatInterval: null,
  flyInterval: null,
  _originalCenterHTML: "",
  get originalCenterHTML() {
    return this._originalCenterHTML;
  },
  set originalCenterHTML(html) {
    this._originalCenterHTML = html;
  },
};

export function addLumens(amount) {
  state.lumens += amount;
}

export function spendLumens(amount) {
  state.lumens -= amount;
}
