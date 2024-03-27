const minutes = 60 * 1000;

/**
 * The cooldown time for fetching recent data in milliseconds.
 */
export const RECENT_DATA_FETCH_COOLDOWN_IN_MILLISECONDS = minutes * 2;
/**
 * The cooldown time for fetching recent data in seconds.
 */
export const RECENT_DATA_FETCH_COOLDOWN_IN_SECONDS =
  RECENT_DATA_FETCH_COOLDOWN_IN_MILLISECONDS / 1000;
