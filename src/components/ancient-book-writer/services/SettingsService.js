// SettingsService.js
// Simple localStorage-backed settings. No theme toggle by design —
// the wooden library theme is fixed.

const KEY = 'abw_settings';

const DEFAULTS = {
  animationSpeed: 'normal', // slow | normal | fast
  autoSaveSeconds: 2,
  fontSize: 'medium', // small | medium | large
  pageWidth: 'normal', // narrow | normal | wide
  soundEnabled: true,
};

export const SettingsService = {
  get() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
    } catch {
      return { ...DEFAULTS };
    }
  },
  save(partial) {
    const merged = { ...this.get(), ...partial };
    localStorage.setItem(KEY, JSON.stringify(merged));
    return merged;
  },
  reset() {
    localStorage.removeItem(KEY);
    return { ...DEFAULTS };
  },
};
