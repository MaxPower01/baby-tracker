/* -------------------------------------------------------------------------- */
/*                                 Stopwatches                                */
/* -------------------------------------------------------------------------- */
/**
 * Formats a number representing milliseconds into a string of the format "hh:mm:ss" or "<hour> s <minute> m <second> s"
 * @param time Milliseconds
 * @returns String of the format "mm:ss"
 */

import formatStopwatchesTime from "@/utils/formatStopwatchesTime";

export default function formatStopwatchTime(
  time: number,
  showLetters = false,
  showSeconds = true,
  hideHoursIfZero = true,
  roundSeconds = false
) {
  return formatStopwatchesTime(
    [time],
    showLetters,
    showSeconds,
    hideHoursIfZero,
    roundSeconds
  );
}
