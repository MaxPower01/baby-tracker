export type BarChartDatapoint = {
  id: string;
  date: Date;
  /**
   * The value of the datapoint.
   * Might be a count, duration, or volume depending on the Y-axis type.
   * If it's a duration, the value is in minutes.
   * If it's a volume, the value is in milliliters.
   */
  value: number;
  isEmpty: boolean;
};
