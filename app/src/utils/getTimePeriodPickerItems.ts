import { TimePeriodId } from "@/enums/TimePeriodId";

export function getTimePeriodPickerItems() {
  return [
    // {
    //   id: TimePeriodId.AllTime,
    //   label: "Tout le temps",
    // },
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
      label: "7 derniers jours",
    },
    {
      id: TimePeriodId.Last14Days,
      label: "14 derniers jours",
    },
    {
      id: TimePeriodId.Last30Days,
      label: "30 derniers jours",
    },
    // {
    //   id: TimePeriodId.Custom,
    //   label: "Sélectionner une période",
    // },
  ];
}
