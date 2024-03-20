import { Entry } from "@/pages/Entry/types/Entry";

export function entryHasStopwatchRunning(entry: Entry): boolean {
  const result = entry.leftStopwatchIsRunning || entry.rightStopwatchIsRunning;
  return result || false;
}
