import PageName from "@/common/enums/PageName";
import ActivityType from "@/modules/activities/enums/ActivityType";
import { EntryModel } from "@/modules/entries/models/EntryModel";

/* -------------------------------------------------------------------------- */
/*                                 Exportation                                */
/* -------------------------------------------------------------------------- */

export function exportToJSONFile(data: any): void {
  const fileName = `baby-tracker-data-${Date.now()}.json`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
  );
  a.setAttribute("download", fileName);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* -------------------------------------------------------------------------- */
/*                                   Entries                                  */
/* -------------------------------------------------------------------------- */

/**
 * Groups entries by date
 * @param entries The entries to group
 * @returns The entries grouped by date
 */
export function groupEntriesByDate(entries: EntryModel[]): {
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
        entries: EntryModel[];
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
    a.timestamp > b.timestamp ? a : b
  );
  const mostRecentDate = mostRecentEntry.startDate;
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
          entries: entries.filter(
            (entry) =>
              entry.startDate.getFullYear() === i &&
              entry.startDate.getMonth() === j &&
              entry.startDate.getDate() === k
          ),
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
  entries: EntryModel[];
  timeUnit: "hour" | "minute";
  timeStep: number;
}) {
  const { entries, timeUnit, timeStep } = params;
  const result = [] as Array<{
    entries: EntryModel[];
  }>;
  if (!entries || entries.length === 0) return result;
  // Sort entries by timestamp, from most recent to least recent
  const sortedEntries = entries.sort((a, b) => b.timestamp - a.timestamp);
  let lastDate = sortedEntries[0].startDate;
  let currentGroup = {
    entries: [] as EntryModel[],
  };
  for (let i = 0; i < sortedEntries.length; i++) {
    const entry = entries[i];
    const entryDate = entry.startDate;
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
/*                                 Stopwatches                                */
/* -------------------------------------------------------------------------- */

/**
 * Formats a millisecond into a string of the format "hh:mm:ss" or "<hour> s <minute> m <second> s"
 * @param time Milliseconds
 * @returns String of the format "mm:ss"
 */
export function formatStopwatchTime(
  time: number,
  showLetters = false,
  showSeconds = true
) {
  return formatStopwatchesTime([time], showLetters, showSeconds);
}

/**
 * Formats an array of milliseconds into a string of the format "hh:mm:ss" or "<hour> s <minute> m <second> s"
 * @param time Array of milliseconds
 * @returns String of the format "mm:ss"
 */
export function formatStopwatchesTime(
  time: number[],
  showLetters = false,
  showSeconds = true
) {
  const totalTime = Math.floor(time.reduce((a, b) => a + b, 0));
  if (totalTime === 0) {
    if (showLetters) {
      return "0 s";
    }
    return "00:00";
  }
  let seconds = Math.floor((totalTime % 60000) / 1000);
  let minutes = Math.floor((totalTime % 3600000) / 60000);
  let hours = Math.floor(totalTime / 3600000);
  let result = "";
  if (hours > 99) {
    if (showLetters) {
      const _days = Math.floor(hours / 24);
      if (_days > 99) {
        return `99+ j`;
      }
      const _hours = hours % 24;
      result += `${_days.toString()} j`;
      if (_hours > 0) {
        result += ` ${_hours.toString()} h`;
      }
      if (minutes > 0) {
        result += ` ${minutes.toString()} m`;
      }
      if (seconds > 0 && showSeconds) {
        result += ` ${seconds.toString()} s`;
      }
      return result;
    }
    hours = 99;
    minutes = 59;
    seconds = 59;
  }
  if (hours > 0) {
    if (showLetters) {
      result += `${hours.toString()} h `;
    } else {
      result += `${hours.toString().padStart(2, "0")}`;
    }
  } else if (!showLetters) {
    result += `00`;
  }
  if (minutes > 0) {
    if (showLetters) {
      result += `${minutes.toString()} m `;
    } else {
      result += `${minutes.toString().padStart(2, "0")}`;
    }
  } else if (!showLetters) {
    result += `00`;
  }
  if (seconds > 0 && showSeconds) {
    if (showLetters) {
      result += `${seconds.toString()} s`;
    } else {
      result += `${seconds.toString().padStart(2, "0")}`;
    }
  } else if (!showLetters) {
    result += `00`;
  }
  if (!showLetters) {
    result = result.replace(/^(..)(.+)/, "$1:$2");
    result = result.replace(/(.+)(..)$/, "$1:$2");
  }

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
  if (typeof type === "number") {
    return Object.values(ActivityType).includes(type);
  }
  if (typeof type === "string") {
    return Object.values(ActivityType).includes(parseInt(type));
  }
  return false;
}

/* -------------------------------------------------------------------------- */
/*                                 Navigation                                 */
/* -------------------------------------------------------------------------- */

export function getPath({
  page,
  id,
  params,
}: {
  page: PageName;
  id?: string | number;
  params?: Record<string, string>;
}) {
  let path = "";
  if (Object.values(PageName).includes(page)) {
    path = `/${page}`;
  }
  if (typeof id !== "undefined") {
    path += `/${id}`;
  }
  if (params) {
    path += `?${new URLSearchParams(params).toString()}`;
  }
  return path;
}

export function getPageTitle(pathname: string) {
  const pageName = getPageName(pathname);
  switch (pageName) {
    case PageName.Home:
      return "Accueil";
    case PageName.Graphics:
      return "Graphiques";
    case PageName.Menu:
      return "Menu";
    case PageName.Calendar:
      return "Calendrier";
    case PageName.Entry:
      const entryId = pathname.substring(1).split("/")[1];
      if (entryId) {
        return "Modifier une entrée";
      }
      return "Ajouter une entrée";
    case PageName.Authentication:
      return "Connexion";
    case PageName.Children:
      return "Enfants";
    default:
      return "";
  }
}

export function getPageName(pathname: string): PageName {
  let page = pathname.substring(1).split("/")[0];
  if (page === "") {
    page = PageName.Home;
  }
  if (Object.values(PageName).includes(page as PageName)) {
    return page as PageName;
  }
  return PageName.Home;
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

export function getInitialState<T>(key: string, defaultValue: T): T {
  const localState = getLocalState(key, defaultValue);
  // TODO:
  // Check if the local state is valid. If not, use the default state
  // and save it to local storage.
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
