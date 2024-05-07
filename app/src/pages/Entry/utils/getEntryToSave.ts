import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

export function getEntryToSave(entry: Entry, babyId: string): Entry {
  const newEntry = { ...entry };
  newEntry.babyId = babyId;
  if (newEntry.leftVolume === 0) {
    newEntry.leftVolume = null;
  }
  if (newEntry.rightVolume === 0) {
    newEntry.rightVolume = null;
  }
  if (newEntry.weight === 0) {
    newEntry.weight = null;
  }
  if (newEntry.size === 0) {
    newEntry.size = null;
  }
  if (newEntry.temperature === 0) {
    newEntry.temperature = null;
  }
  if (newEntry.leftTime === 0) {
    newEntry.leftTime = null;
  }
  if (newEntry.rightTime === 0) {
    newEntry.rightTime = null;
  }
  if (newEntry.urineAmount === 0) {
    newEntry.urineAmount = null;
  }
  if (newEntry.poopAmount === 0) {
    newEntry.poopAmount = null;
    newEntry.poopColorId = null;
    newEntry.poopTextureId = null;
  }
  if (newEntry.poopColorId === 0) {
    newEntry.poopColorId = null;
  }
  if (newEntry.poopTextureId === 0) {
    newEntry.poopTextureId = null;
  }
  if (newEntry.leftStopwatchLastUpdateTime === 0) {
    newEntry.leftStopwatchLastUpdateTime = null;
  }
  if (newEntry.rightStopwatchLastUpdateTime === 0) {
    newEntry.rightStopwatchLastUpdateTime = null;
  }
  if (newEntry.poopHasUndigestedPieces == null) {
    newEntry.poopHasUndigestedPieces = false;
  }
  return newEntry;
}
