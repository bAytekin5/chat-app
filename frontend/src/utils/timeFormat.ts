export function timeFormat(dateString: string) {
  if (!dateString) return "00:00";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "00:00";

  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());

  return `${hours}:${minutes}`;

  function padZero(number: number) {
    return number.toString().padStart(2, "0");
  }
}
