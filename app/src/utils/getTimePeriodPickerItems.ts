import { TimePeriodId } from "@/enums/TimePeriodId";

export function getTimePeriodPickerItems() {
  return [
    {
      id: TimePeriodId.Today,
      label: "24 dernières heures",
    },
    {
      id: TimePeriodId.Last2Days,
      label: "48 dernières heures",
    },
    {
      id: TimePeriodId.Last7Days,
      label: "7 derniers jours",
      divider: true,
    },
    {
      id: TimePeriodId.Last14Days,
      label: "14 derniers jours",
    },
    {
      id: TimePeriodId.Last30Days,
      label: "30 derniers jours",
    },
    {
      id: TimePeriodId.Last3Months,
      label: "3 derniers mois",
      divider: true,
    },
    {
      id: TimePeriodId.Last6Months,
      label: "6 derniers mois",
    },
    {
      id: TimePeriodId.ThisYear,
      label: "12 derniers mois",
    },
    {
      id: TimePeriodId.AllTime,
      label: "Tout le temps",
      divider: true,
    },
    // {
    //   id: TimePeriodId.Custom,
    //   label: "Choisir une période",
    // },
  ];
}
