// getDay.utils.js

/**
 * Returns the current day of the week.
 * @param {boolean} [shortFormat=false] - If true, returns abbreviated day name (e.g., 'Mon').
 * @returns {string} Day name.
 */
export function getCurrentDay(shortFormat = false) {
  const fullDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date();
  const index = today.getDay();

  return shortFormat ? shortDays[index] : fullDays[index];
}
