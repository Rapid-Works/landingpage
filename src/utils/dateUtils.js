export const getNextWebinarDates = (count = 5) => {
  const dates = [];
  const now = new Date(); // Current time

  // --- Define Base Dates in UTC ---
  // Exception: Wednesday, April 30th, 2025, 17:00 CEST (15:00 UTC)
  const exceptionDate = new Date(Date.UTC(2025, 3, 30, 15, 0, 0)); // Month 3 is April

  // Reference Thursday: May 15th, 2025, 17:00 CEST (15:00 UTC)
  let nextThursday = new Date(Date.UTC(2025, 4, 15, 15, 0, 0)); // Month 4 is May

  // Reference Saturday: May 17th, 2025, 10:00 CEST (08:00 UTC)
  let nextSaturday = new Date(Date.UTC(2025, 4, 17, 8, 0, 0)); // Month 4 is May

  // --- Add Exception if in Future ---
  if (exceptionDate > now) {
    dates.push(exceptionDate);
  }

  // --- Find First Relevant Thursday & Saturday After Now ---
  // Adjust starting Thursdays/Saturdays until they are after 'now'
  while (nextThursday <= now) {
    nextThursday.setDate(nextThursday.getDate() + 14);
  }
  while (nextSaturday <= now) {
    nextSaturday.setDate(nextSaturday.getDate() + 14);
  }

  // --- Generate Future Dates ---
  // Keep adding Thursdays and Saturdays until we have enough dates
  while (dates.length < count) {
    // Add the next valid Thursday and Saturday
    // We check again if they are truly after 'now' in case the first ones were calculated
    // before the exception date but are still after 'now'.
    if (nextThursday > now) dates.push(new Date(nextThursday));
    if (nextSaturday > now && dates.length < count) dates.push(new Date(nextSaturday)); // Avoid adding extra if count reached

    // Calculate the next ones in the sequence
    nextThursday.setDate(nextThursday.getDate() + 14);
    nextSaturday.setDate(nextSaturday.getDate() + 14);

    // Safety break if something goes wrong (shouldn't be needed)
    // Increased check slightly to allow generating enough candidates
    if (dates.length > count + 10) break;
  }

  // --- Sort and Trim ---
  dates.sort((a, b) => a - b); // Sort chronologically
  return dates.slice(0, count); // Return the desired number of dates
}; 