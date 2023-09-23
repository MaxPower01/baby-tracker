export default function formatBabyAge(
  birthDate: Date,
  format?: "days" | "weeks" | "months" | "years"
) {
  try {
    const now = new Date();
    const ageInDays = Math.floor(
      (now.setHours(0, 0, 0, 0) - new Date(birthDate).setHours(0, 0, 0, 0)) /
        (1000 * 3600 * 24) +
        0
    );
    const ageInWeeks = Math.floor(ageInDays / 7 + 0);
    const ageInMonths = Math.floor(ageInDays / 30 + 0);
    const ageInYears = Math.floor(ageInDays / 365 + 0);
    if (!format) {
      if (ageInDays >= 365) {
        format = "years";
      } else if (ageInDays >= 30) {
        format = "months";
      } else if (ageInDays >= 7) {
        format = "weeks";
      } else {
        format = "days";
      }
    }
    switch (format) {
      case "years":
        const reminderMonths = 12 - (ageInMonths % 12);
        if (reminderMonths === 0) {
          return `${ageInYears} an${ageInYears > 1 ? "s" : ""}`;
        } else {
          return `${ageInYears} an${
            ageInYears > 1 ? "s" : ""
          } et ${reminderMonths} mois`;
        }
      case "months":
        const reminderWeeks = 4 - (ageInWeeks % 4);
        if (reminderWeeks === 0) {
          return `${ageInMonths} mois`;
        } else {
          return `${ageInMonths} mois et ${reminderWeeks} semaine${
            reminderWeeks > 1 ? "s" : ""
          }`;
        }
      case "weeks":
        const reminderDays = 7 - (ageInDays % 7);
        if (reminderDays === 0) {
          return `${ageInWeeks} semaine${ageInWeeks > 1 ? "s" : ""}`;
        } else {
          return `${ageInWeeks} semaine${
            ageInWeeks > 1 ? "s" : ""
          } et ${reminderDays} jour${reminderDays > 1 ? "s" : ""}`;
        }
      case "days":
      default:
        if (ageInDays === 0) return "moins d'un jour";
        return `${ageInDays} jour${ageInDays > 1 ? "s" : ""}`;
    }
  } catch (error) {
    console.error("Error in formatBabyAge: ", error);
    return "";
  }
}
