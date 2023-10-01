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
    /* 
      Voici quelques exemples de formats possibles:

      - Moins d'un jour
      - 1 jour
      - 2 jours
      - 1 semaine
      - 1 semaine et 1 jour
      - 1 semaine et 2 jours
      - 2 semaines
      - 2 semaines et 1 jour
      - 2 semaines et 2 jours
      - 1 mois
      - 1 mois et 1 semaine
      - 1 mois et 2 semaines
      - 1 an
      - 1 an et 1 mois

      Voici comment on peut les calculer:

      - Si le bébé a moins d'un jour, on affiche "Moins d'un jour"
      - Si le bébé a moins d'une semaine, on affiche le nombre de jours
      - Si le bébé a moins d'un mois, on affiche le nombre de semaines et le nombre de jours
      - Si le bébé a moins d'un an, on affiche le nombre de mois et le nombre de semaines
      - Si le bébé a plus d'un an, on affiche le nombre d'années et le nombre de mois

      Pour calculer l'âge en jours/semaines, on utilise la méthode suivante:

      - On soustrait la date de naissance à la date du jour sans prendre en compte les heures, minutes, secondes et millisecondes
      - On divise le résultat par 7 pour avoir le nombre de semaines

      Pour calculer l'âge en mois, c'est un peu plus compliqué. On doit prendre en considération
      le nombre de jours dans le mois en cours et le nombre de jours dans le mois de naissance.
      
      Voici quelques exemples ainsi que les résultats attendus:

      - Supposant que le bébé est né le 31 mars:
        - Si on est le 1er avril, le bébé a 1 jour
        - Si on est le 29 avril, le bébé a 29 jours
        - Si on est le 30 avril, le bébé a 1 mois (car le mois de naissance a 31 jours et que le mois en cours a 30 jours)

      - Supposant que le bébé est né le 28 février:
        - Si on est le 1er mars, le bébé a 1 jour
        - Si on est le 27 mars, le bébé a 27 jours
        - Si on est le 28, 29, 30 ou 31 mars, le bébé a 1 mois (car le mois de naissance a 28 jours et que le mois en cours a 31 jours).

      Bref, pour calculer le nombre de mois, on doit prendre en considération le nombre de jours dans le mois de naissance ainsi que le nombre de jours dans le mois en cours.

      Voici donc comment procéder pour calculer le nombre de mois:

      - On note l'index du mois de naissance (0 = janvier, 1 = février, etc.)
      - On note l'index du mois en cours
      - La différence nous donne le nombre de mois
      - On note la date de naissance (e.g. 31 mars)
      - On note la date en cours (e.g. 30 avril)
      - Si la date en cours est plus petite que la date de naissance, on soustrait 1 au nombre de mois
    */
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
