import { v4 as uuid } from "uuid";

export const recentAgeDateLimitInDays = 2;

/**
 * Represents the age limit for recent data in seconds. Data older than this should not be considered recent.
 */
export const recentAgeDataLimitInSeconds =
  60 * 60 * 24 * recentAgeDateLimitInDays;

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

/**
 * The time in seconds after which the stopwatch should still be displayed after stopping it.
 * This is to allow the user to restart the stopwatch if they accidentally stopped it and want to continue.
 */
export const stopwatchDisplayTimeAfterStopInSeconds = 60 * 5;

export const bottomBarId = `bottom-bar-${uuid()}`;
export const customBottomBarId = `custom-bottom-bar-${uuid()}`;

export const resetFiltersButtonId = `reset-filters-button-${uuid()}`;
