import { BarChartDatapoint } from "@/pages/Charts/types/BarChartDatapoint";
import { DatapointCategory } from "@/pages/Charts/enums/DatapointCategory";

export type StackedBarChartDatapoint = BarChartDatapoint & {
  category: DatapointCategory;
  dateISOString: string;
};
