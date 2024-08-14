import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { getTimestamp } from "@/utils/getTimestamp";

export function getMockEntries(
  fromDate: Date,
  untilDate: Date,
  babyId: string
): Entry[] {
  const result: Entry[] = [];

  try {
    const daysCount = Math.floor(
      (untilDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    for (let i = 0; i < daysCount; i++) {
      const date = new Date(fromDate.getTime() + i * 1000 * 60 * 60 * 24);
      result.push(...getRandomActivityEntriesFor(date, babyId));
      result.push(...getRandomBreastFeedingEntriesFor(date, babyId));
      result.push(...getRandomBottleFeedingEntriesFor(date, babyId));
      result.push(...getRandomDiaperEntriesFor(date, babyId));
    }
  } catch (error) {
    console.error(error);
  } finally {
    return result;
  }
}

function getNumberWithinRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomActivityEntriesFor(date: Date, babyId: string): Entry[] {
  const result: Entry[] = [];

  const entriesCount = getNumberWithinRange(0, 4);

  let startHour: number | null = null;

  for (let j = 0; j < entriesCount; j++) {
    if (startHour === null) {
      startHour = 8;
    } else {
      startHour += 2;
    }

    const durationInMinutes = getNumberWithinRange(15, 120);

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

  const entriesCount = getNumberWithinRange(3, 8);

  let startHour: number | null = null;

  for (let j = 0; j < entriesCount; j++) {
    const currentSide: "left" | "right" = j % 2 === 0 ? "left" : "right";

    if (startHour === null) {
      startHour = 8;
    } else {
      startHour += 1;
    }

    const duration = getNumberWithinRange(5, 45);

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

function getRandomBottleFeedingEntriesFor(date: Date, babyId: string): Entry[] {
  const result: Entry[] = [];

  const entriesCount = getNumberWithinRange(3, 8);

  let startHour: number | null = null;
  for (let j = 0; j < entriesCount; j++) {
    if (startHour === null) {
      startHour = 8;
    } else {
      startHour += 1;
    }

    const duration = getNumberWithinRange(5, 45);
    const volume = getNumberWithinRange(30, 180);

    const startDate = new Date(date);
    startDate.setHours(startHour, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + duration);

    const entry: Entry = {
      babyId: babyId,
      entryTypeId: EntryTypeId.BottleFeeding,
      startTimestamp: getTimestamp(startDate),
      endTimestamp: getTimestamp(endDate),
      note: "",
      imageURLs: [],
      activityContexts: [],
      leftVolume: volume,
      rightVolume: null,
      weight: null,
      size: null,
      temperature: null,
      leftTime: duration * 60 * 1000,
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

function getRandomDiaperEntriesFor(date: Date, babyId: string): Entry[] {
  const result: Entry[] = [];

  const entriesCount = getNumberWithinRange(2, 5);

  let startHour: number | null = null;

  for (let j = 0; j < entriesCount; j++) {
    if (startHour === null) {
      startHour = 8;
    } else {
      startHour += 3;
    }

    const diaperType: "pee" | "poop" = j % 2 === 0 ? "pee" : "poop";

    const amount = getNumberWithinRange(1, 5);

    const volume = getNumberWithinRange(30, 180);

    const startDate = new Date(date);
    startDate.setHours(startHour, 0, 0, 0);

    const entry: Entry = {
      babyId: babyId,
      entryTypeId: EntryTypeId.Diaper,
      startTimestamp: getTimestamp(startDate),
      endTimestamp: getTimestamp(startDate),
      note: "",
      imageURLs: [],
      activityContexts: [],
      leftVolume: volume,
      rightVolume: null,
      weight: null,
      size: null,
      temperature: null,
      leftTime: null,
      leftStopwatchIsRunning: false,
      leftStopwatchLastUpdateTime: null,
      rightTime: null,
      rightStopwatchIsRunning: false,
      rightStopwatchLastUpdateTime: null,
      urineAmount: diaperType === "pee" ? amount : null,
      poopAmount: diaperType === "poop" ? amount : null,
      poopColorId: null,
      poopTextureId: null,
      poopHasUndigestedPieces: null,
    };

    result.push(entry);
  }
  return result;
}
