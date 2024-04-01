/**
 * Represents the age limit for recent data in seconds. Data older than this should not be considered recent.
 */
export const recentAgeDataLimitInSeconds = 60 * 60 * 48;

/**
 * Represents the age limit for recent data in milliseconds. Data older than this should not be considered recent.
 */
export const recentAgeDataLimitInMilliseconds =
  recentAgeDataLimitInSeconds * 1000;

/**
 * The cooldown time for fetching recent data in seconds.
 */
export const recentDataFetchCooldownInSeconds = 5;

/**
 * The cooldown time for fetching recent data in milliseconds.
 */
export const recentDataFetchCooldownInMilliseconds =
  recentDataFetchCooldownInSeconds * 1000;

export const bottomBarNewEntryFabId = "bottom-bar-new-entry-fab";
