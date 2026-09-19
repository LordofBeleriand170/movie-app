export const formatDate = (
  dateString: string | Date | undefined | null,
): string => {
  if (!dateString) return "N/A";

  const date =
    typeof dateString === "string" || typeof dateString === "number"
      ? new Date(dateString)
      : dateString;

  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC", // ensure deterministic output
  });
};
