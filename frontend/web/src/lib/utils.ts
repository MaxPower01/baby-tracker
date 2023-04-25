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

/**
 * Increments a number by a given amount.
 * @param number The number to increment.
 * @param increment The amount to increment the number by. Defaults to 1.
 * @returns The incremented number.
 */
export function increment(value: number, increment: number = 1) {
  return value + increment;
}

/**
 * Decrements a number by a given amount.
 * @param number The number to decrement.
 * @param decrement The amount to decrement the number by. Defaults to 1.
 * @returns The decremented number.
 */
export function decrement(value: number, decrement: number = 1) {
  return value - decrement;
}

/* -------------------------------------------------------------------------- */
/*                              String extensions                             */
/* -------------------------------------------------------------------------- */

/**
 * Adds a prefix to the string.
 * @param value The string to add the prefix to.
 * @param pre Prefix to add to the string.
 * @returns The string with the prefix added.
 */
export function addPrefix(value: string, pre: string) {
  return pre + value;
}

/**
 * Checks if the string is null or whitespace.
 * @param value The string to check.
 * @returns True if the string is null or whitespace, false otherwise.
 */
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
