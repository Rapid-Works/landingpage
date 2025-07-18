export const getNextWebinarDates = (count = 5) => {
  const dates = [];
  const now = new Date(); // Current time

  // --- Define Base Dates in UTC ---
  // Exception: Wednesday, April 30th, 2025, 17:00 CEST (15:00 UTC)
  const exceptionDate = new Date(Date.UTC(2025, 5, 3, 15, 0, 0)); // Month 3 is April
  
  // Additional exception: July 17th, 2025, 17:00 CEST (15:00 UTC) - replacement for skipped July 10th
  const julyExceptionDate = new Date(Date.UTC(2025, 6, 17, 15, 0, 0)); // July 17th, 2025

  // Additional exception: July 31st, 2025, 17:00 CEST (15:00 UTC) - replacement for skipped July 24th
  const julyExceptionDate2 = new Date(Date.UTC(2025, 6, 31, 15, 0, 0)); // July 31st, 2025

  // Skip dates - dates to exclude from the regular schedule
  const skipDates = [
    new Date(Date.UTC(2025, 6, 10, 15, 0, 0)), // July 10th, 2025 - Thursday to skip
    new Date(Date.UTC(2025, 6, 12, 8, 0, 0)),  // July 12th, 2025 - Saturday to skip (same week)
    new Date(Date.UTC(2025, 6, 24, 15, 0, 0)), // July 24th, 2025 - Thursday to skip (moved to July 31st)
  ];

  // Reference Thursday: May 15th, 2025, 17:00 CEST (15:00 UTC)
  let nextThursday = new Date(Date.UTC(2025, 4, 15, 15, 0, 0)); // Month 4 is May

  // Reference Saturday: May 17th, 2025, 10:00 CEST (08:00 UTC)
  let nextSaturday = new Date(Date.UTC(2025, 4, 17, 8, 0, 0)); // Month 4 is May

  // Helper function to check if a date should be skipped
  const shouldSkipDate = (date) => {
    return skipDates.some(skipDate => 
      date.getTime() === skipDate.getTime()
    );
  };

  // --- Add Exception if in Future ---
  if (exceptionDate > now) {
    dates.push(exceptionDate);
  }
  
  // Add July 17th exception if in future
  if (julyExceptionDate > now) {
    dates.push(julyExceptionDate);
  }
  
  // Add July 31st exception if in future
  if (julyExceptionDate2 > now) {
    dates.push(julyExceptionDate2);
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
    // Add the next valid Thursday and Saturday (if not in skip list)
    // We check again if they are truly after 'now' in case the first ones were calculated
    // before the exception date but are still after 'now'.
    if (nextThursday > now && !shouldSkipDate(nextThursday)) {
      dates.push(new Date(nextThursday));
    }
    if (nextSaturday > now && !shouldSkipDate(nextSaturday) && dates.length < count) {
      dates.push(new Date(nextSaturday)); // Avoid adding extra if count reached
    }

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