const hours = 60 * 60;

/**
 * Represents the age limit for recent data in seconds. Data older than this should not be considered recent.
 */
export const RECENT_DATA_AGE_LIMIT_IN_SECONDS = hours * 48;

/**
 * Represents the age limit for recent data in milliseconds. Data older than this should not be considered recent.
 */
export const RECENT_DATA_AGE_LIMIT_IN_MILLISECONDS =
  RECENT_DATA_AGE_LIMIT_IN_SECONDS * 1000;
