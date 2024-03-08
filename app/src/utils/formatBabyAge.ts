import { getAgeInMonths } from "./getAgeInMonths";
import { getAgeInWeeks } from "@/utils/getAgeInWeeks";
import { getWeeksSinceCurrentMonthAnniversary } from "@/utils/getWeeksSinceCurrentMonthAnniversary";

export default function formatBabyAge(
  dateOfBirth: Date,
  format?: "days" | "weeks" | "months" | "years"
): string {
  const now = new Date();
  const days = Math.floor(
    (now.getTime() - dateOfBirth.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (!format) {
    if (days >= 365) {
      format = "years";
    } else if (days >= 30) {
      format = "months";
    } else if (days >= 7) {
      format = "weeks";
    } else {
      format = "days";
    }
  } else if (format === "years" && days < 365) {
    format = "months";
  } else if (format === "months" && days < 30) {
    format = "weeks";
  } else if (format === "weeks" && days < 7) {
    format = "days";
  }

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
        result += `${years} année${years > 1 ? "s" : ""}`;
      }
      if (remainingMonths > 0) {
        result += ` et ${remainingMonths} mois`;
      }
      break;
    case "months":
      if (months > 0) {
        result += `${months} mois`;
      }
      if (weeks > 0) {
        result += ` et ${weeks} semaine${weeks > 1 ? "s" : ""}`;
      }
      break;
    case "weeks":
      if (weeks > 0) {
        result += `${weeks} semaine${weeks > 1 ? "s" : ""}`;
      }
      const remainingDays = days % 7;
      if (remainingDays > 0) {
        result += ` et ${remainingDays} jour${remainingDays > 1 ? "s" : ""}`;
      }
      break;
    case "days":
      if (days > 0) {
        result += `${days} jour${days > 1 ? "s" : ""}`;
      }
      break;
    default:
      result = "";
  }

  return result;
}
