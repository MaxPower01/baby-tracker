import { DailyEntries } from "@/types/DailyEntries";
import { Entry } from "@/pages/Entry/types/Entry";

/**
 * A map of date keys to arrays of entries for that date. The date keys are in the format 'YYYY-MM-DD'.
 */

export type DailyEntriesCollection = Record<string, DailyEntries>;
