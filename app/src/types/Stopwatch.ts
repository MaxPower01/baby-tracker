import { StopwatchAction } from "@/types/StopwatchAction";

export interface Stopwatch {
  side: "left" | "right" | null;
  isRunning: boolean;
  duration: number | null;
  actions: StopwatchAction[];
}
