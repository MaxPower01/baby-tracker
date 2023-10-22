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
    const ageInWeeks = ageInDays === 0 ? 0 : Math.floor(ageInDays / 7);

    // Set default format if not provided or if provided format is not valid

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
    } else if (format === "years" && ageInDays < 365) {
      format = "months";
    } else if (format === "months" && ageInDays < 30) {
      format = "weeks";
    } else if (format === "weeks" && ageInDays < 7) {
      format = "days";
    }

    switch (format) {
      case "years":
        const birthYear = birthDate.getFullYear();
        const currentYear = now.getFullYear();
        let ageInYears = currentYear - birthYear;
        const birthDateMonthNumber = birthDate.getMonth();
        const currentDateMonthNumber = now.getMonth();
        if (currentDateMonthNumber < birthDateMonthNumber) {
          ageInYears--;
        }
        let yearsResult = `${ageInYears} an${ageInYears > 1 ? "s" : ""}`;
        if (currentDateMonthNumber > birthDateMonthNumber) {
          const remainingMonths = currentDateMonthNumber - birthDateMonthNumber;
          if (remainingMonths > 0) {
            yearsResult += ` et ${remainingMonths} mois`;
          }
        }
        return yearsResult;
      case "months":
        const birthMonth = birthDate.getMonth();
        const currentMonth = now.getMonth();
        let ageInMonths = currentMonth - birthMonth;
        const birthDateDayNumber = birthDate.getDate();
        const currentDateDayNumber = now.getDate();
        if (currentDateDayNumber < birthDateDayNumber) {
          ageInMonths--;
        }
        let monthsResult = `${ageInMonths} mois`;
        if (currentDateDayNumber > birthDateDayNumber) {
          const remainingDays = currentDateDayNumber - birthDateDayNumber;
          const remainingWeeks =
            remainingDays > 0 ? Math.floor(remainingDays / 7) : 0;
          if (remainingWeeks > 0) {
            monthsResult += `${remainingWeeks} semaine${
              remainingWeeks > 1 ? "s" : ""
            }`;
          }
        }
        return monthsResult;
      case "weeks":
        if (ageInDays === 0) return "moins d'une semaine";
        let weeksResult = `${ageInWeeks} semaine${ageInWeeks > 1 ? "s" : ""}`;
        const remainingDays = ageInDays - ageInWeeks * 7;
        if (remainingDays > 0) {
          weeksResult += ` et ${remainingDays} jour${
            remainingDays > 1 ? "s" : ""
          }`;
        }
        return weeksResult;
      case "days":
      default:
        if (ageInDays === 0) return "moins d'un jour";
        let daysResult = `${ageInDays} jour${ageInDays > 1 ? "s" : ""}`;
        return daysResult;
    }
  } catch (error) {
    console.error("Error in formatBabyAge: ", error);
    return "";
  }
}
