import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { getTimestamp } from "@/utils/getTimestamp";

export function getMockEntries(
  startDate: Date,
  endDate: Date,
  babyId: string
): Entry[] {
  const result: Entry[] = [];

  try {
    const daysCount = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    for (let i = 0; i < daysCount; i++) {
      const date = new Date(startDate.getTime() + i * 1000 * 60 * 60 * 24);
      result.push(...getRandomActivityEntriesFor(date, babyId));
      result.push(...getRandomBreastFeedingEntriesFor(date, babyId));
    }
  } catch (error) {
    console.error(error);
  } finally {
    return result;
  }
}

function getRandomActivityEntriesFor(date: Date, babyId: string): Entry[] {
  const result: Entry[] = [];

  // There should be between 0 and 4 entries of type EntryTypeId.Activity per day.
  // The duration of those entries should be between 15 minutes and 2 hours.

  const entriesCount = Math.floor(Math.random() * 5);

  let startHour: number | null = null;
  let durationInMinutes: number | null = null;

  for (let j = 0; j < entriesCount; j++) {
    if (durationInMinutes === null) {
      durationInMinutes = 15;
    } else {
      durationInMinutes = Math.floor(Math.random() * 106 + 15);
    }

    if (startHour === null) {
      startHour = 8;
    } else {
      startHour += 2;
    }

    const startDate = new Date(date);
    startDate.setHours(startHour, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + durationInMinutes);

    const entry: Entry = {
      babyId: babyId,
      entryTypeId: EntryTypeId.Activity,
      startTimestamp: getTimestamp(startDate),
      endTimestamp: getTimestamp(endDate),
      note: "",
      imageURLs: [],
      activityContexts: [],
      leftVolume: null,
      rightVolume: null,
      weight: null,
      size: null,
      temperature: null,
      leftTime: durationInMinutes * 60 * 1000,
      leftStopwatchIsRunning: false,
      leftStopwatchLastUpdateTime: null,
      rightTime: null,
      rightStopwatchIsRunning: false,
      rightStopwatchLastUpdateTime: null,
      urineAmount: null,
      poopAmount: null,
      poopColorId: null,
      poopTextureId: null,
      poopHasUndigestedPieces: null,
    };

    result.push(entry);
  }
  return result;
}

function getRandomBreastFeedingEntriesFor(date: Date, babyId: string): Entry[] {
  const result: Entry[] = [];

  // There should be between 3 and 8 entries of type EntryTypeId.BreastFeeding per day.
  // The duration of those entries should be between 5 minutes and 45 minutes and alternate between left and right.

  const entriesCount = Math.floor(Math.random() * 5);

  let startHour: number | null = null;
  let leftDurationInMinutes = Math.floor(Math.random() * 41 + 5);
  let rightDurationInMinutes = Math.floor(Math.random() * 41 + 5);

  for (let j = 0; j < entriesCount; j++) {
    const currentSide: "left" | "right" = j % 2 === 0 ? "left" : "right";

    if (startHour === null) {
      startHour = 8;
    } else {
      startHour += 1;
    }

    const duration =
      currentSide === "left" ? leftDurationInMinutes : rightDurationInMinutes;

    const startDate = new Date(date);
    startDate.setHours(startHour, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + duration);

    const entry: Entry = {
      babyId: babyId,
      entryTypeId: EntryTypeId.BreastFeeding,
      startTimestamp: getTimestamp(startDate),
      endTimestamp: getTimestamp(endDate),
      note: "",
      imageURLs: [],
      activityContexts: [],
      leftVolume: null,
      rightVolume: null,
      weight: null,
      size: null,
      temperature: null,
      leftTime: currentSide === "left" ? duration * 60 * 1000 : null,
      leftStopwatchIsRunning: false,
      leftStopwatchLastUpdateTime: null,
      rightTime: currentSide === "right" ? duration * 60 * 1000 : null,
      rightStopwatchIsRunning: false,
      rightStopwatchLastUpdateTime: null,
      urineAmount: null,
      poopAmount: null,
      poopColorId: null,
      poopTextureId: null,
      poopHasUndigestedPieces: null,
    };

    result.push(entry);
  }
  return result;
}
