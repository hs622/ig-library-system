/**
 * Converts a timestamp (ISO string, Date, or epoch ms) into a readable
 * format like "May 5, 2001".
 */
export function formatReadableDate(timestamp: string | number | Date): string {
  const date = new Date(timestamp);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}