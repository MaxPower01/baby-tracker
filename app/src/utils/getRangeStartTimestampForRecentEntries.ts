import { RECENT_TIME_RANGE } from "@/constants/RECENT_TIME_RANGE";
import { Timestamp } from "firebase/firestore";

export function getRangeStartTimestampForRecentEntries() {
  const rangeEndDate = new Date();
  const rangeStartDate = new Date(rangeEndDate.getTime() - RECENT_TIME_RANGE);
  const rangeStartTimestamp = Timestamp.fromDate(rangeStartDate);
  return rangeStartTimestamp;
}
