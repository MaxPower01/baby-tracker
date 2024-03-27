const hours = 1000 * 60 * 60;

/**
 * Represents the age limit for recent data in milliseconds. Data older than this should not be considered recent.
 */
export const RECENT_DATA_AGE_LIMIT_IN_MILLISECONDS = hours * 48;
/**
 * Represents the age limit for recent data in seconds. Data older than this should not be considered recent.
 */
export const RECENT_DATA_AGE_LIMIT_IN_SECONDS =
  RECENT_DATA_AGE_LIMIT_IN_MILLISECONDS / 1000;
