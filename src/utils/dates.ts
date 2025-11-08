export const yesterday = new Date(Date.now() - 864e5)
  .toISOString()
  .split("T")[0]; // YYYY-MM-DD

export const today = new Date(Date.now())
  .toISOString()
  .split("T")[0]; // YYYY-MM-DD
