// Small helpers for persisting redux slices of state to localStorage so a
// page refresh doesn't wipe the cart.

export const loadState = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const saveState = (key, state) => {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable (private mode, quota, etc.) - fail silently.
  }
};
