import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { SortOrderId } from "@/enums/SortOrderId";

export function getSortOrderItems() {
  return [
    {
      id: SortOrderId.DateDesc,
      label: "Date : Plus récent en premier",
      Icon: CalendarTodayIcon,
    },
    {
      id: SortOrderId.DateAsc,
      label: "Date : Plus ancien en premier",
      Icon: CalendarTodayIcon,
    },
  ];
}
