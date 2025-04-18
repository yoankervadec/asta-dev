//
// server/back-end/utils/dateHelper.js

export const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const montrealOffset = -300; // Offset in minutes (UTC-5 hours)
  const isDST = date.getMonth() >= 2 && date.getMonth() <= 10; // Rough DST check for North America
  const adjustedOffset = montrealOffset + (isDST ? 60 : 0);

  // Apply offset in milliseconds
  const adjustedDate = new Date(date.getTime() + adjustedOffset * 60 * 1000);

  // Format to `yyyy-mm-dd hh:mm:ss`
  const year = adjustedDate.getUTCFullYear();
  const month = String(adjustedDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(adjustedDate.getUTCDate()).padStart(2, "0");
  const hours = String(adjustedDate.getUTCHours()).padStart(2, "0");
  const minutes = String(adjustedDate.getUTCMinutes()).padStart(2, "0");
  const seconds = String(adjustedDate.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
