import { getAgeInMonths } from "./getAgeInMonths";
import { getAgeInWeeks } from "@/utils/getAgeInWeeks";
import { getWeeksSinceCurrentMonthAnniversary } from "@/utils/getWeeksSinceCurrentMonthAnniversary";

export default function formatBabyAge(
  dateOfBirth: Date,
  format: string
): string {
  const now = new Date();
  const days = Math.floor(
    (now.getTime() - dateOfBirth.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weeks =
    format === "months"
      ? getWeeksSinceCurrentMonthAnniversary(dateOfBirth)
      : Math.floor(days / 7);
  const months = getAgeInMonths(dateOfBirth);
  const years = Math.floor(months / 12);

  let result = "";

  switch (format) {
    case "years":
      const remainingMonths = months % 12;
      if (years > 0) {
        result += `${years} years`;
      }
      if (remainingMonths > 0) {
        result += ` and ${remainingMonths} months`;
      }
      break;
    case "months":
      if (months > 0) {
        result += `${months} months`;
      }
      if (weeks > 0) {
        result += ` and ${weeks} weeks`;
      }
      break;
    case "weeks":
      if (weeks > 0) {
        result += `${weeks} weeks`;
      }
      const remainingDays = days % 7;
      if (remainingDays > 0) {
        result += ` and ${remainingDays} days`;
      }
      break;
    case "days":
      if (days > 0) {
        result += `${days} days`;
      }
      break;
    default:
      result = "Invalid format";
  }

  return result;
}
