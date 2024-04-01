import ActivityType from "@/pages/Activity/enums/ActivityType";
import { Entry } from "@/pages/Entry/types/Entry";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";

/* -------------------------------------------------------------------------- */
/*                                   Entries                                  */
/* -------------------------------------------------------------------------- */

/**
 * Groups entries by date
 * @param entries The entries to group
 * @returns The entries grouped by date
 */
export function groupEntriesByDate(entries: Entry[]): {
  years: Array<{
    /**
     * 4-digit year
     * @example 2021
     */
    year: number;
    months: Array<{
      /**
       * 0-indexed month
       * @example 0 = January
       */
      monthIndex: number;
      days: Array<{
        /**
         * 1-indexed day
         * @example 1 = 1st
         */
        dayNumber: number;
        entries: Entry[];
      }>;
    }>;
  }>;
} {
  const result = {
    years: [] as Array<any>,
  };
  if (!entries || entries.length === 0) return result;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const mostRecentEntry = entries.reduce((a, b) =>
    a.startTimestamp > b.startTimestamp ? a : b
  );
  // const mostRecentDate = new Date(mostRecentEntry.startTimestamp);
  const mostRecentDate = getDateFromTimestamp(mostRecentEntry.startTimestamp);
  const mostRecentYear = mostRecentDate.getFullYear();
  for (let i = currentYear; i >= mostRecentYear; i--) {
    const yearEntries = {
      year: i,
      months: [] as Array<any>,
    };
    const month = i == currentYear ? currentMonth : 11;
    for (let j = month; j >= 0; j--) {
      const monthEntries = {
        monthIndex: j,
        days: [] as Array<any>,
      };
      const daysOfMonth = new Date(i, j + 1, 0).getDate();
      for (let k = daysOfMonth; k >= 1; k--) {
        const dayEntries = {
          dayNumber: k,
          entries: entries.filter((entry) => {
            // const startDate = new Date(entry.startTimestamp);
            const startDate = getDateFromTimestamp(entry.startTimestamp);
            return (
              startDate.getFullYear() === i &&
              startDate.getMonth() === j &&
              startDate.getDate() === k
            );
          }),
        };
        monthEntries.days.push(dayEntries);
      }
      yearEntries.months.push(monthEntries);
    }
    result.years.push(yearEntries);
  }
  return result;
}

/**
 * Groups entries that are close in time
 * @param entries The entries to group
 * @param timeUnit The unit of time to group by
 * @param timeStep The amount of time to group by
 * @returns The entries grouped by time
 */
export function groupEntriesByTime(params: {
  entries: Entry[];
  timeUnit: "hour" | "minute";
  timeStep: number;
}) {
  const { entries, timeUnit, timeStep } = params;
  const result = [] as Array<{
    entries: Entry[];
  }>;
  if (!entries || entries.length === 0) return result;
  // Sort entries by timestamp, from most recent to least recent
  const sortedEntries = entries.sort(
    (a, b) => b.startTimestamp - a.startTimestamp
  );
  // let lastDate = new Date(sortedEntries[0].startTimestamp);
  let lastDate = getDateFromTimestamp(sortedEntries[0].startTimestamp);
  let currentGroup = {
    entries: [] as Entry[],
  };
  for (let i = 0; i < sortedEntries.length; i++) {
    const entry = entries[i];
    // const entryDate = new Date(entry.startTimestamp);
    const entryDate = getDateFromTimestamp(entry.startTimestamp);
    const previousEntryDate = lastDate;
    const timeDifference = previousEntryDate.getTime() - entryDate.getTime();
    const timeDifferenceInMinutes = Math.floor(timeDifference / 60000);
    if (
      (timeUnit === "minute" && timeDifferenceInMinutes <= timeStep) ||
      (timeUnit === "hour" && timeDifferenceInMinutes <= timeStep * 60)
    ) {
      currentGroup.entries.push(entry);
    }
    // If the entry is too far from the previous entry, start a new group
    else {
      result.push(currentGroup);
      currentGroup = {
        entries: [entry],
      };
    }
    lastDate = entryDate;
  }
  result.push(currentGroup);
  // For each group, verify that
  return result;
}

/* -------------------------------------------------------------------------- */
/*                                    Dates                                   */
/* -------------------------------------------------------------------------- */

export function formatTime(time: Date) {
  // return stopDateTime.toLocaleTimeString([], {
  //   hour: "2-digit",
  //   minute: "2-digit",
  // });
  return time.toLocaleTimeString("fr-CA");
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("fr-CA");
}

export function formatDateTime(dateTime: Date) {
  return dateTime.toLocaleString();
}

export function getMonthName(month: number) {
  return new Date(0, month).toLocaleString("default", { month: "long" });
}

/* -------------------------------------------------------------------------- */
/*                                 Activities                                 */
/* -------------------------------------------------------------------------- */

export function isValidActivityType(type: any) {
  if (!type) return false;
  if (typeof type === "number") {
    return Object.values(ActivityType).includes(type);
  }
  if (typeof type === "string") {
    return Object.values(ActivityType).includes(parseInt(type));
  }
  return false;
}

/* -------------------------------------------------------------------------- */
/*                                 Local state                                */
/* -------------------------------------------------------------------------- */

export function getLocalState<T>(key: string, defaultValue: T): T {
  const localState = localStorage.getItem(key);
  if (localState) {
    return JSON.parse(localState);
  }
  return defaultValue;
}

export function setLocalState<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
}

export function getInitialState<T>(
  key: string,
  defaultValue: T,
  parser?: (value: T) => T
): T {
  const localState = getLocalState(key, defaultValue);
  if (parser) return parser(localState);
  return localState;
}

/* -------------------------------------------------------------------------- */
/*                              Array extensions                              */
/* -------------------------------------------------------------------------- */

/**
 * Checks if the given index is in the range of the array.
 * @param array The array to check.
 * @param index The index to check.
 * @returns True if the index is in the range of the array, false otherwise.
 */
export function isValidArrayIndex<T>(array: Array<T>, index: number) {
  return !(index < 0 || index >= array.length);
}

/**
 * Adds a value to an array at the given index.
 * @param array The array to add the value to.
 * @param index The index to add the value at.
 * @param value The value to add.
 * @returns The array with the value added, or the original array if the index is invalid.
 */
export function addValueAtIndex<T>(array: Array<T>, index: number, value: T) {
  if (isValidArrayIndex(array, index) && index !== array.length) {
    return [...array.slice(0, index), value, ...array.slice(index)];
  }
  return array;
}

/**
 * Updates a value in an array at the given index.
 * @param array The array to update the value in.
 * @param index The index to update the value at.
 * @param updater The updater to use to update the value.
 * @returns The array with the value updated, or the original array if the index is invalid.
 */
export function updateValueAtIndex<T>(
  array: Array<T>,
  index: number,
  updater: (previousValue: T) => T
) {
  if (isValidArrayIndex(array, index)) {
    return [
      ...array.slice(0, index),
      updater(array[index]),
      ...array.slice(index + 1),
    ];
  }
  return array;
}

/**
 * Replaces a value in an array at the given index.
 * @param array The array to replace the value in.
 * @param index The index to replace the value at.
 * @param newValue The new value to replace the old value with.
 * @returns The array with the value replaced, or the original array if the index is invalid.
 */
export function replaceValueAtIndex<T>(
  array: Array<T>,
  index: number,
  newValue: T
) {
  if (isValidArrayIndex(array, index)) {
    return [...array.slice(0, index), newValue, ...array.slice(index + 1)];
  }
  return array;
}

/**
 * Removes a value from an array at the given index.
 * @param array The array to remove the value from.
 * @param index The index to remove the value at.
 * @returns The array with the value removed, or the original array if the index is invalid.
 */
export function removeValueAtIndex<T>(array: Array<T>, index: number) {
  if (isValidArrayIndex(array, index)) {
    return [...array.slice(0, index), ...array.slice(index + 1)];
  }
  return array;
}

/* -------------------------------------------------------------------------- */
/*                             Boolean extensions                             */
/* -------------------------------------------------------------------------- */

/**
 * Toggles a boolean value.
 * @param value The value to toggle.
 * @returns The opposite of the value.
 */
export function toggle(value: boolean) {
  return !value;
}

/* -------------------------------------------------------------------------- */
/*                              Number extensions                             */
/* -------------------------------------------------------------------------- */

export function increment(value: number, increment: number = 1) {
  return value + increment;
}

export function decrement(value: number, decrement: number = 1) {
  return value - decrement;
}

export function isNumber(value: string) {
  return !isNaN(Number(value));
}

/* -------------------------------------------------------------------------- */
/*                              String extensions                             */
/* -------------------------------------------------------------------------- */

export function addPrefix(value: string, prefix: string) {
  return prefix + value;
}

export function isNullOrWhiteSpace(value: string | undefined | null) {
  if (value === undefined || value === null) return true;
  return value === null || value.match(/^ *$/) !== null;
}

/**
 * Converts the string to uppercase first.
 * @param value The string to convert.
 * @returns The string with the first character in uppercase.
 */
export function upperCaseFirst(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
