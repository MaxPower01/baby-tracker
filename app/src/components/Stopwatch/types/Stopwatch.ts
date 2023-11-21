import { StopwatchAction } from "@/components/Stopwatch/types/StopwatchAction";

export interface Stopwatch {
  side: "left" | "right" | null;
  isRunning: boolean;
  duration: number | null;
  actions: StopwatchAction[];
}
