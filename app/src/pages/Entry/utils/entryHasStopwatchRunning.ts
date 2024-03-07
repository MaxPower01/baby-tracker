import { Entry } from "@/pages/Entry/types/Entry";

export function entryHasStopwatchRunning(entry: Entry): boolean {
  const result =
    entry.stopwatch?.isRunning ||
    entry.stopwatches?.some((stopwatch) => stopwatch.isRunning);
  return result || false;
}
