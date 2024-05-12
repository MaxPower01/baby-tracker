import { TimePeriodId } from "@/enums/TimePeriodId";

export function getTimePeriodPickerItems() {
  return [
    {
      id: TimePeriodId.Today,
      label: "Aujourd'hui",
    },
    {
      id: TimePeriodId.Last2Days,
      label: "2 derniers jours",
    },
    {
      id: TimePeriodId.Last7Days,
      label: "Cette semaine",
    },
    {
      id: TimePeriodId.Last14Days,
      label: "14 derniers jours",
    },
    {
      id: TimePeriodId.Last30Days,
      label: "Ce mois-ci",
    },
    {
      id: TimePeriodId.Last3Months,
      label: "3 derniers mois",
    },
    {
      id: TimePeriodId.Last6Months,
      label: "6 derniers mois",
    },
    {
      id: TimePeriodId.ThisYear,
      label: "Cette année",
    },
    // {
    //   id: TimePeriodId.AllTime,
    //   label: "Tout le temps",
    // },
    // {
    //   id: TimePeriodId.Custom,
    //   label: "Choisir une période",
    // },
  ];
}
