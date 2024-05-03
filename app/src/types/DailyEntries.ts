import { ExistingEntry } from "@/pages/Entry/types/Entry";

export type DailyEntries = {
  /**
   * A Unix timestamp in seconds that corresponds to the start of the day in UTC time.
   */
  timestamp: number;
  entries: ExistingEntry[];
};
