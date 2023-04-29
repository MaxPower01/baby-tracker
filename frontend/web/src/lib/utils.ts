import { ActivityType, PageName } from "./enums";

/* -------------------------------------------------------------------------- */
/*                                 Stopwatches                                */
/* -------------------------------------------------------------------------- */

export function formatStopwatchTime(time: number) {
  return formatStopwatchesTime([time]);
}

export function formatStopwatchesTime(time: number[]) {
  const totalSeconds = time.reduce((a, b) => a + b, 0);
  if (totalSeconds === 0) return "00:00";
  const seconds = totalSeconds % 60;
  const secondsLabel = seconds.toString().padStart(2, "0");
  const minutes = Math.floor(totalSeconds / 60);
  const minutesLabel = minutes.toString().padStart(2, "0");
  return `${minutesLabel}:${secondsLabel}`;
}

/* -------------------------------------------------------------------------- */
/*                                    Dates                                   */
/* -------------------------------------------------------------------------- */

export function formatTime(time: Date) {
  // return stopDateTime.toLocaleTimeString([], {
  //   hour: "2-digit",
  //   minute: "2-digit",
  // });
  return time.toLocaleTimeString();
}

export function formatDate(date: Date) {
  return date.toLocaleDateString();
}

export function formatDateTime(dateTime: Date) {
  return dateTime.toLocaleString();
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
  let path = getPagePath(page);
  if (typeof id !== "undefined") {
    path += `/${id}`;
  }
  if (params) {
    path += `?${new URLSearchParams(params).toString()}`;
  }
  return path;
}

export function getPagePath(page: PageName) {
  switch (page) {
    case PageName.Home:
      return "/home";
    case PageName.Stats:
      return "/stats";
    case PageName.Settings:
      return "/settings";
    case PageName.Calendar:
      return "/calendar";
    case PageName.Entry:
      return "/entry";
    default:
      return "";
  }
}

export function getPageTitle(pathname: string) {
  const pageName = getPageName(pathname);
  switch (pageName) {
    case PageName.Home:
      return "Accueil";
    case PageName.Stats:
      return "Statistiques";
    case PageName.Settings:
      return "Paramètres";
    case PageName.Calendar:
      return "Calendrier";
    case PageName.Entry:
      const entryId = pathname.substring(1).split("/")[1];
      if (entryId) {
        return "Modifier une entrée";
      }
      return "Ajouter une entrée";
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
