import { BarChartDatapoint } from "@/pages/Charts/types/BarChartDatapoint";

export type StackedBarChartDatapoint = BarChartDatapoint & {
  category: string;
};
